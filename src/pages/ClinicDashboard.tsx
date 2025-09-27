import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Camera,
  Plus,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  MapPin,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import {
  submitPhotoRequest,
  submitInventoryRequest,
  getUserRequests,
  getClinicRequestHistory,
  getInventory,
  Paginated,
  DrugRequest,
  Product,
  Order,
} from "@/lib/api";

export default function ClinicDashboard() {
  const [requestsData, setRequestsData] = useState<Paginated<DrugRequest>>({
    data: [],
    pagination: { current: 1, pages: 0, total: 0 },
  });
  const [historyData, setHistoryData] = useState<Paginated<DrugRequest>>({
    data: [],
    pagination: { current: 1, pages: 0, total: 0 },
  });
  const [productsData, setProductsData] = useState<Paginated<Product>>({
    data: [],
    pagination: { current: 1, pages: 0, total: 0 },
  });
  const [loading, setLoading] = useState(false);
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [requestType, setRequestType] = useState<"photo" | "inventory">(
    "photo"
  );
  const [selectedProducts, setSelectedProducts] = useState<
    { productId: string; quantity: number }[]
  >([]);

  const { user } = useAuth();
  const { toast } = useToast();

  // Pagination, search, filter for requests
  const [requestsPage, setRequestsPage] = useState(1);
  const [requestsSearch, setRequestsSearch] = useState("");
  const [requestsFilter, setRequestsFilter] = useState("all");

  // Pagination, search, filter for history
  const [historyPage, setHistoryPage] = useState(1);
  const [historySearch, setHistorySearch] = useState("");
  const [historyFilter, setHistoryFilter] = useState("all");

  // Pagination, search, filter for products (if needed)
  const [productsPage, setProductsPage] = useState(1);
  const [productsSearch, setProductsSearch] = useState("");
  const [productsFilter, setProductsFilter] = useState("");

  // Form data
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [patientInfo, setPatientInfo] = useState("");

  const PAGE_SIZE = 3;

  useEffect(() => {
    loadData();
  }, [
    requestsPage,
    requestsSearch,
    requestsFilter,
    historyPage,
    historySearch,
    historyFilter,
    productsPage,
    productsSearch,
    productsFilter,
  ]);

  const loadData = async () => {
    try {
      const requestsFilterParam =
        requestsFilter === "all" ? "" : requestsFilter;
      const historyFilterParam = historyFilter === "all" ? "" : historyFilter;
      const productsFilterParam =
        productsFilter === "all" ? "" : productsFilter;

      const requestsPromise = getUserRequests(
        requestsPage,
        PAGE_SIZE,
        requestsSearch,
        requestsFilterParam
      );
      const historyPromise = getClinicRequestHistory(
        historyPage,
        PAGE_SIZE,
        historySearch,
        historyFilterParam
      );

      if (user?.role === "pharmacy") {
        const inventoryPromise = getInventory(
          productsPage,
          10,
          productsSearch,
          productsFilterParam
        );

        const [requestsResult, historyResult, productsResult] =
          (await Promise.all([
            requestsPromise,
            historyPromise,
            inventoryPromise,
          ])) as [
            Paginated<DrugRequest>,
            Paginated<DrugRequest>,
            Paginated<Product>
          ];

        setRequestsData(requestsResult);
        setHistoryData(historyResult);
        setProductsData(productsResult);
      } else {
        const [requestsResult, historyResult] = (await Promise.all([
          requestsPromise,
          historyPromise,
        ])) as [Paginated<DrugRequest>, Paginated<DrugRequest>];

        setRequestsData(requestsResult);
        setHistoryData(historyResult);
        setProductsData({
          data: [],
          pagination: { current: 1, pages: 0, total: 0 },
        });
      }
    } catch (error) {
      // If error is auth-related for non-pharmacy, ignore and set empty products
      if (error instanceof Error && error.message.includes("not authorized")) {
        setProductsData({
          data: [],
          pagination: { current: 1, pages: 0, total: 0 },
        });
      } else {
        toast({
          title: "Error loading data",
          description: "Could not fetch requests or inventory.",
          variant: "destructive",
        });
      }
      console.error("Error loading data:", error);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setPhotoFiles(files);
    }
  };

  const submitPhotoRequestHandler = async () => {
    if (photoFiles.length === 0 || !deliveryAddress) {
      toast({
        title: "Missing Information",
        description:
          "Please upload at least one photo and provide delivery address.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      await submitPhotoRequest(
        {
          deliveryAddress,
          patientInfo,
        },
        photoFiles
      );

      toast({
        title: "Request Submitted",
        description:
          "Your photo request has been sent to the pharmacy for review.",
      });

      setIsNewRequestOpen(false);
      resetForm();
      setRequestsPage(1); // Reset to first page
      loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const submitInventoryRequestHandler = async () => {
    if (selectedProducts.length === 0 || !deliveryAddress) {
      toast({
        title: "Missing Information",
        description: "Please select products and provide delivery address.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await submitInventoryRequest({
        selectedProducts,
        deliveryAddress,
        patientInfo,
      });

      toast({
        title: "Request Submitted",
        description: "Your inventory request has been sent to the pharmacy.",
      });

      setIsNewRequestOpen(false);
      resetForm();
      setRequestsPage(1); // Reset to first page
      loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setPhotoFiles([]);
    setDeliveryAddress("");
    setPatientInfo("");
    setSelectedProducts([]);
    setRequestType("photo");
  };

  const updateProductQuantity = (productId: string, quantity: number) => {
    setSelectedProducts((prev) => {
      const existing = prev.find((p) => p.productId === productId);
      if (existing) {
        if (quantity === 0) {
          return prev.filter((p) => p.productId !== productId);
        }
        return prev.map((p) =>
          p.productId === productId ? { ...p, quantity } : p
        );
      } else if (quantity > 0) {
        return [...prev, { productId, quantity }];
      }
      return prev;
    });
  };

  const handleRequestsPageChange = (newPage: number) => {
    setRequestsPage(newPage);
  };

  const handleHistoryPageChange = (newPage: number) => {
    setHistoryPage(newPage);
  };

  const handleRequestsSearch = (value: string) => {
    setRequestsSearch(value);
    setRequestsPage(1);
  };

  const handleHistorySearch = (value: string) => {
    setHistorySearch(value);
    setHistoryPage(1);
  };

  const handleProductsPageChange = (newPage: number) => {
    setProductsPage(newPage);
  };

  const handleProductsSearch = (value: string) => {
    setProductsSearch(value);
    setProductsPage(1);
  };

  const getStatusIcon = (status: DrugRequest["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-warning" />;
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-destructive" />;
      case "assigned":
      case "picked_up":
      case "in_transit":
        return <Truck className="h-4 w-4 text-accent" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-success" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: DrugRequest["status"]) => {
    switch (status) {
      case "pending":
        return "bg-warning text-warning-foreground";
      case "confirmed":
        return "bg-success text-success-foreground";
      case "rejected":
        return "bg-destructive text-destructive-foreground";
      case "assigned":
      case "picked_up":
      case "in_transit":
        return "bg-accent text-accent-foreground";
      case "delivered":
        return "bg-success text-success-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const isPharmacy = user?.role === "pharmacy";
  const requests = requestsData.data;
  const history = historyData.data;
  const products = productsData.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Healthcare Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage your drug requests and deliveries
          </p>
        </div>

        <Dialog open={isNewRequestOpen} onOpenChange={setIsNewRequestOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Drug Request</DialogTitle>
              <DialogDescription>
                Submit a request by uploading a photo or selecting from
                available inventory.
              </DialogDescription>
            </DialogHeader>

            <Tabs
              value={requestType}
              onValueChange={(value) =>
                setRequestType(value as "photo" | "inventory")
              }
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="photo" className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Photo Request
                </TabsTrigger>
                <TabsTrigger
                  value="inventory"
                  className="flex items-center gap-2"
                  disabled={!isPharmacy} // Disable for non-pharmacies
                >
                  <Package className="h-4 w-4" />
                  From Inventory
                </TabsTrigger>
              </TabsList>

              <TabsContent value="photo" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="photo">
                    Upload Drug Photos (Multiple Allowed)
                  </Label>
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="cursor-pointer"
                  />
                  {photoFiles.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      Selected {photoFiles.length} file(s):{" "}
                      {photoFiles.map((f) => f.name).join(", ")}
                    </p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="inventory" className="space-y-4">
                {isPharmacy ? (
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {products.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No inventory available at this time.
                      </p>
                    ) : (
                      products.map((product) => {
                        const selected = selectedProducts.find(
                          (p) => p.productId === product._id
                        );
                        return (
                          <div
                            key={product._id}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {product.description}
                              </p>
                              <p className="text-sm font-medium text-primary">
                                ${product.price}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  updateProductQuantity(
                                    product._id,
                                    (selected?.quantity || 0) - 1
                                  )
                                }
                                disabled={!selected || selected.quantity <= 0}
                              >
                                -
                              </Button>
                              <span className="w-8 text-center">
                                {selected?.quantity || 0}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  updateProductQuantity(
                                    product._id,
                                    (selected?.quantity || 0) + 1
                                  )
                                }
                                disabled={
                                  product.quantity <= (selected?.quantity || 0)
                                }
                              >
                                +
                              </Button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Inventory selection is available for pharmacies only.</p>
                    <p className="text-sm">Use photo requests for clinics.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Delivery Address</Label>
                <Input
                  id="address"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Enter full delivery address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="patient">Patient Information (Optional)</Label>
                <Textarea
                  id="patient"
                  value={patientInfo}
                  onChange={(e) => setPatientInfo(e.target.value)}
                  placeholder="Patient details, special instructions, etc."
                />
              </div>

              <Button
                onClick={
                  requestType === "photo"
                    ? submitPhotoRequestHandler
                    : submitInventoryRequestHandler
                }
                disabled={
                  loading || (!isPharmacy && requestType === "inventory")
                }
                className="w-full"
              >
                {loading ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* My Requests */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              My Requests
            </CardTitle>
            <CardDescription>
              Track all your drug requests including pending ones
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search requests..."
                className="pl-10 w-48"
                value={requestsSearch}
                onChange={(e) => handleRequestsSearch(e.target.value)}
              />
            </div>
            <Select value={requestsFilter} onValueChange={setRequestsFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Clock className="h-4 w-4 mr-2" />
                  History ({historyData.pagination.total})
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Request History</DialogTitle>
                  <DialogDescription>
                    View your past and completed requests (excluding pending)
                  </DialogDescription>
                </DialogHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search history..."
                        className="pl-10 w-48"
                        value={historySearch}
                        onChange={(e) => handleHistorySearch(e.target.value)}
                      />
                    </div>
                    <Select
                      value={historyFilter}
                      onValueChange={setHistoryFilter}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="photo">Photo Requests</SelectItem>
                        <SelectItem value="inventory">
                          Inventory Requests
                        </SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-4">
                  {history.length === 0 ? (
                    <div className="text-center py-8">
                      <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        No completed requests yet.
                      </p>
                    </div>
                  ) : (
                    <>
                      {history.map((request) => (
                        <div
                          key={request._id}
                          className="border rounded-lg p-4 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Badge
                                variant="outline"
                                className={getStatusColor(request.status)}
                              >
                                {getStatusIcon(request.status)}
                                {request.status
                                  .replace(/_/g, " ")
                                  .toUpperCase()}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                Updated:{" "}
                                {new Date(
                                  request.updatedAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <Badge variant="secondary">
                              {request.type === "photo"
                                ? "Photo Request"
                                : "Inventory Request"}
                            </Badge>
                          </div>

                          {request.type === "photo" &&
                            request.photoUrls &&
                            request.photoUrls.length > 0 && (
                              <div className="space-y-2">
                                <p className="text-sm font-medium">
                                  Uploaded Photos:
                                </p>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                  {request.photoUrls.map((photoUrl, index) => (
                                    <div key={index} className="relative group">
                                      <img
                                        src={photoUrl}
                                        alt={`Submitted drug photo ${
                                          index + 1
                                        }`}
                                        className="max-w-full h-32 object-cover rounded-lg shadow-md"
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                          {request.type === "inventory" &&
                            request.selectedProducts && (
                              <div className="space-y-2">
                                <p className="text-sm font-medium">
                                  Requested Items:
                                </p>
                                <div className="grid gap-2">
                                  {request.selectedProducts.map(
                                    (item, index) => (
                                      <div
                                        key={index}
                                        className="text-sm text-muted-foreground"
                                      >
                                        • {item.productName} (Qty:{" "}
                                        {item.quantity})
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            )}

                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            {request.deliveryAddress}
                          </div>

                          {request.status === "rejected" &&
                            request.rejectionReason && (
                              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                                <p className="text-sm font-medium text-destructive">
                                  Rejection Reason:
                                </p>
                                <p className="text-sm text-destructive/80">
                                  {request.rejectionReason}
                                </p>
                              </div>
                            )}

                          {request.status === "confirmed" && request.order && (
                            <div className="bg-success/10 border border-success/20 rounded-lg p-3">
                              <p className="text-sm font-medium text-success">
                                Order Details:
                              </p>
                              <div className="text-sm text-success/80 space-y-1">
                                <div>Order ID: {request.order._id}</div>
                                <div>Total: ${request.order.totalAmount}</div>
                                <div>
                                  Pharmacy:{" "}
                                  {typeof request.order.pharmacyId === "string"
                                    ? request.order.pharmacyId
                                    : request.order.pharmacyId?.name ??
                                      "Unknown"}
                                </div>
                                <div>
                                  Order Status:{" "}
                                  {request.order.status.replace(/_/g, " ")}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                      {/* Pagination for History */}
                      {historyData.pagination.pages > 1 && (
                        <div className="flex items-center justify-between pt-4">
                          <div className="text-sm text-muted-foreground">
                            Showing {(historyPage - 1) * PAGE_SIZE + 1} to{" "}
                            {Math.min(
                              historyPage * PAGE_SIZE,
                              historyData.pagination.total
                            )}{" "}
                            of {historyData.pagination.total} results
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleHistoryPageChange(historyPage - 1)
                              }
                              disabled={historyPage === 1}
                            >
                              <ChevronLeft className="h-4 w-4" />
                              Previous
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleHistoryPageChange(historyPage + 1)
                              }
                              disabled={
                                historyPage === historyData.pagination.pages
                              }
                            >
                              Next
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No requests yet. Create your first request above!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div
                  key={request._id}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="outline"
                        className={getStatusColor(request.status)}
                      >
                        {getStatusIcon(request.status)}
                        {request.status.replace(/_/g, " ").toUpperCase()}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <Badge variant="secondary">
                      {request.type === "photo"
                        ? "Photo Request"
                        : "Inventory Request"}
                    </Badge>
                  </div>

                  {request.type === "photo" &&
                    request.photoUrls &&
                    request.photoUrls.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Uploaded Photos:</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {request.photoUrls.map((photoUrl, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={photoUrl}
                                alt={`Submitted drug photo ${index + 1}`}
                                className="max-w-full h-32 object-cover rounded-lg shadow-md"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {request.type === "inventory" && request.selectedProducts && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Requested Items:</p>
                      <div className="grid gap-2">
                        {request.selectedProducts.map((item, index) => (
                          <div
                            key={index}
                            className="text-sm text-muted-foreground"
                          >
                            • {item.productName} (Qty: {item.quantity})
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {request.deliveryAddress}
                  </div>

                  {request.status === "rejected" && request.rejectionReason && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                      <p className="text-sm font-medium text-destructive">
                        Rejection Reason:
                      </p>
                      <p className="text-sm text-destructive/80">
                        {request.rejectionReason}
                      </p>
                    </div>
                  )}
                </div>
              ))}
              {/* Pagination for Requests */}
              {requestsData.pagination.pages > 1 && (
                <div className="flex items-center justify-between pt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {(requestsPage - 1) * PAGE_SIZE + 1} to{" "}
                    {Math.min(
                      requestsPage * PAGE_SIZE,
                      requestsData.pagination.total
                    )}{" "}
                    of {requestsData.pagination.total} results
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRequestsPageChange(requestsPage - 1)}
                      disabled={requestsPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRequestsPageChange(requestsPage + 1)}
                      disabled={requestsPage === requestsData.pagination.pages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
