/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/PharmacyDashboard.tsx
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
  Plus,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Image,
  Edit,
  Trash2,
  Phone,
  Building,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  getPendingRequests,
  confirmRequest,
  rejectRequest,
  getInventory,
  addProduct,
  deleteProduct,
  downloadPhoto,
  downloadAllPhotos,
  Paginated,
  DrugRequest,
  Product,
} from "@/lib/api";

export default function PharmacyDashboard() {
  const [pendingRequestsData, setPendingRequestsData] = useState<
    Paginated<DrugRequest>
  >({ data: [], pagination: { current: 1, pages: 0, total: 0 } });
  const [productsData, setProductsData] = useState<Paginated<Product>>({
    data: [],
    pagination: { current: 1, pages: 0, total: 0 },
  });
  const [loading, setLoading] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<DrugRequest | null>(
    null
  );
  const [viewImageUrl, setViewImageUrl] = useState<string | null>(null);

  // Pagination, search, filter for pending requests
  const [requestsPage, setRequestsPage] = useState(1);
  const [requestsSearch, setRequestsSearch] = useState("");
  const [requestsFilter, setRequestsFilter] = useState("all");

  // Pagination, search, filter for products
  const [productsPage, setProductsPage] = useState(1);
  const [productsSearch, setProductsSearch] = useState("");
  const [productsFilter, setProductsFilter] = useState("all");

  const { toast } = useToast();

  // Product form data
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    category: "",
    image: null as File | null,
  });

  useEffect(() => {
    loadData();
  }, [
    requestsPage,
    requestsSearch,
    requestsFilter,
    productsPage,
    productsSearch,
    productsFilter,
  ]);

  const loadData = async () => {
    try {
      const [requests, inventory] = await Promise.all([
        getPendingRequests(requestsPage, 10, requestsSearch, requestsFilter),
        getInventory(
          productsPage,
          10,
          productsSearch,
          productsFilter === "all" ? "" : productsFilter
        ),
      ]);
      setPendingRequestsData(requests);
      setProductsData(inventory);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleProductsFilterChange = (value: string) => {
    setProductsFilter(value);
    setProductsPage(1);
  };

  const handleDownloadPhoto = async (id: string, index: number) => {
    try {
      const blob = await downloadPhoto(id, index);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `drug-photo-${id}-${index + 1}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download photo.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadAllPhotos = async (id: string) => {
    try {
      const blob = await downloadAllPhotos(id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `drug-photos-${id}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download all photos.",
        variant: "destructive",
      });
    }
  };

  const handleConfirmRequest = async (requestId: string) => {
    setLoading(true);
    try {
      await confirmRequest(requestId);
      toast({
        title: "Request Confirmed",
        description:
          "The request has been confirmed and an order has been created.",
      });
      setRequestsPage(1); // Reset to first page
      loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to confirm request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Rejection Reason Required",
        description: "Please provide a reason for rejecting this request.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await rejectRequest(requestId, rejectionReason);
      toast({
        title: "Request Rejected",
        description: "The request has been rejected.",
      });
      setRejectionReason("");
      setSelectedRequest(null);
      setRequestsPage(1); // Reset to first page
      loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async () => {
    if (
      !productForm.name ||
      !productForm.description ||
      !productForm.category ||
      !productForm.price ||
      !productForm.quantity
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await addProduct(
        {
          name: productForm.name,
          description: productForm.description,
          price: parseFloat(productForm.price),
          quantity: parseInt(productForm.quantity),
          category: productForm.category,
        },
        productForm.image
      );

      toast({
        title: "Product Added",
        description: "The product has been added to your inventory.",
      });

      setIsAddProductOpen(false);
      setProductForm({
        name: "",
        description: "",
        price: "",
        quantity: "",
        category: "",
        image: null,
      });
      setProductsPage(1); // Reset to first page
      loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await deleteProduct(productId);
      toast({
        title: "Product Deleted",
        description: "The product has been removed from your inventory.",
      });
      loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRequestsPageChange = (newPage: number) => {
    setRequestsPage(newPage);
  };

  const handleProductsPageChange = (newPage: number) => {
    setProductsPage(newPage);
  };

  const handleRequestsSearch = (value: string) => {
    setRequestsSearch(value);
    setRequestsPage(1);
  };

  const handleProductsSearch = (value: string) => {
    setProductsSearch(value);
    setProductsPage(1);
  };

  const pendingRequests = pendingRequestsData.data;
  const products = productsData.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Pharmacy Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage requests, inventory, and orders
          </p>
        </div>

        <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-secondary hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Add a new product to your pharmacy inventory.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={productForm.name}
                  onChange={(e) =>
                    setProductForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="Enter product name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={productForm.description}
                  onChange={(e) =>
                    setProductForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Product description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        price: e.target.value,
                      }))
                    }
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={productForm.quantity}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        quantity: e.target.value,
                      }))
                    }
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={productForm.category}
                  onChange={(e) =>
                    setProductForm((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  placeholder="e.g., Pain Relief, Antibiotics"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Product Image (Optional)</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setProductForm((prev) => ({
                      ...prev,
                      image: e.target.files?.[0] || null,
                    }))
                  }
                />
              </div>

              <Button
                onClick={handleAddProduct}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Adding..." : "Add Product"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="requests" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="requests">
            Pending Requests ({pendingRequestsData.pagination.total})
          </TabsTrigger>
          <TabsTrigger value="inventory">
            Inventory ({productsData.pagination.total})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requests">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Pending Requests
                </CardTitle>
                <CardDescription>
                  Review and process incoming drug requests from clinics
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
                <Select
                  value={requestsFilter}
                  onValueChange={setRequestsFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="photo">Photo Request</SelectItem>
                    <SelectItem value="inventory">Inventory Request</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {pendingRequests.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No pending requests at the moment.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingRequests.map((request) => {
                    let photos: string[] = [];
                    if (request.photoUrls && request.photoUrls.length > 0) {
                      photos = request.photoUrls;
                    } else if (request.photoUrl) {
                      photos = [request.photoUrl];
                    }

                    return (
                      <div
                        key={request._id}
                        className="border rounded-lg p-6 space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">
                              {request.clinicName}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {new Date(request.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <Badge
                            variant="outline"
                            className="bg-warning/10 text-warning"
                          >
                            {request.type === "photo"
                              ? "Photo Request"
                              : "Inventory Request"}
                          </Badge>
                        </div>

                        {/* Clinic Details */}
                        <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-2 text-sm">
                            <Building className="h-4 w-4" />
                            <span className="font-medium">Organization:</span>
                            <span>
                              {(request.clinicId as any)?.organization || "N/A"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4" />
                            <span className="font-medium">Phone:</span>
                            <span>
                              {(request.clinicId as any)?.phone || "N/A"}
                            </span>
                          </div>
                        </div>

                        {request.type === "photo" && photos.length > 0 && (
                          <div className="space-y-2">
                            <div className="flex justify-end mb-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleDownloadAllPhotos(request._id)
                                }
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Download All Photos
                              </Button>
                            </div>
                            <p className="text-sm font-medium">
                              Uploaded Photos:
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {photos.map((url, index) => (
                                <div
                                  key={index}
                                  className="group relative bg-muted rounded-lg p-4 overflow-hidden"
                                >
                                  <img
                                    src={url}
                                    alt={`Drug identification photo ${
                                      index + 1
                                    }`}
                                    className="max-w-full h-48 object-cover rounded-lg shadow-md w-full"
                                  />
                                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 rounded-full p-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setViewImageUrl(url)}
                                      className="h-8 w-8 p-0"
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        handleDownloadPhoto(request._id, index)
                                      }
                                      className="h-8 w-8 p-0"
                                    >
                                      <Download className="h-4 w-4" />
                                    </Button>
                                  </div>
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
                              <div className="bg-muted rounded-lg p-4 space-y-2">
                                {request.selectedProducts.map((item, index) => (
                                  <div
                                    key={index}
                                    className="flex justify-between text-sm"
                                  >
                                    <span>{item.productName}</span>
                                    <span className="font-medium">
                                      Qty: {item.quantity}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                        <div className="space-y-2">
                          <p className="text-sm font-medium">
                            Delivery Address:
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {request.deliveryAddress}
                          </p>
                        </div>

                        {request.patientInfo && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium">
                              Patient Information:
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {request.patientInfo}
                            </p>
                          </div>
                        )}

                        <div className="flex gap-3 pt-4">
                          <Button
                            onClick={() => handleConfirmRequest(request._id)}
                            disabled={loading}
                            className="bg-success hover:bg-success/90"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Confirm & Create Order
                          </Button>

                          <Dialog
                            open={selectedRequest?._id === request._id}
                            onOpenChange={() => setSelectedRequest(null)}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="destructive"
                                onClick={() => setSelectedRequest(request)}
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Reject Request</DialogTitle>
                                <DialogDescription>
                                  Please provide a reason for rejecting this
                                  request.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <Textarea
                                  value={rejectionReason}
                                  onChange={(e) =>
                                    setRejectionReason(e.target.value)
                                  }
                                  placeholder="Enter rejection reason (e.g., out of stock, invalid prescription, etc.)"
                                />
                                <div className="flex gap-3">
                                  <Button
                                    variant="destructive"
                                    onClick={() =>
                                      selectedRequest &&
                                      handleRejectRequest(selectedRequest._id)
                                    }
                                    disabled={loading}
                                  >
                                    Reject Request
                                  </Button>
                                  <Button
                                    variant="outline"
                                    onClick={() => setSelectedRequest(null)}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    );
                  })}
                  {/* Pagination for Requests */}
                  {pendingRequestsData.pagination.pages > 1 && (
                    <div className="flex items-center justify-between pt-4">
                      <div className="text-sm text-muted-foreground">
                        Showing {(requestsPage - 1) * 10 + 1} to{" "}
                        {Math.min(
                          requestsPage * 10,
                          pendingRequestsData.pagination.total
                        )}{" "}
                        of {pendingRequestsData.pagination.total} results
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleRequestsPageChange(requestsPage - 1)
                          }
                          disabled={requestsPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleRequestsPageChange(requestsPage + 1)
                          }
                          disabled={
                            requestsPage ===
                            pendingRequestsData.pagination.pages
                          }
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
        </TabsContent>

        <TabsContent value="inventory">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Inventory Management
                </CardTitle>
                <CardDescription>
                  Manage your pharmacy's drug inventory
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    className="pl-10 w-48"
                    value={productsSearch}
                    onChange={(e) => handleProductsSearch(e.target.value)}
                  />
                </div>
                <Select
                  value={productsFilter}
                  onValueChange={handleProductsFilterChange}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="pain relief">Pain Relief</SelectItem>
                    <SelectItem value="antibiotics">Antibiotics</SelectItem>
                    <SelectItem value="vitamins">Vitamins</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {products.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No products in inventory. Add your first product!
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {products.map((product) => (
                    <div
                      key={product._id}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      {!product.imageUrl ? (
                        <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
                          <Image className="h-12 w-12 text-muted-foreground" />
                        </div>
                      ) : (
                        <div className="relative group">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-48 object-cover rounded-lg"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => setViewImageUrl(product.imageUrl)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {product.description}
                          </p>
                          {product.category && (
                            <Badge variant="secondary" className="mt-2 text-xs">
                              {product.category}
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteProduct(product._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-primary">
                          ${product.price}
                        </span>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Stock</p>
                          <p
                            className={`font-medium ${
                              product.quantity < 10
                                ? "text-warning"
                                : "text-success"
                            }`}
                          >
                            {product.quantity} units
                          </p>
                        </div>
                      </div>

                      {product.quantity < 10 && (
                        <div className="bg-warning/10 border border-warning/20 rounded-lg p-2">
                          <p className="text-xs text-warning font-medium">
                            Low Stock Warning
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                  {/* Pagination for Products */}
                  {productsData.pagination.pages > 1 && (
                    <div className="flex items-center justify-between pt-4">
                      <div className="text-sm text-muted-foreground">
                        Showing {(productsPage - 1) * 10 + 1} to{" "}
                        {Math.min(
                          productsPage * 10,
                          productsData.pagination.total
                        )}{" "}
                        of {productsData.pagination.total} results
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleProductsPageChange(productsPage - 1)
                          }
                          disabled={productsPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleProductsPageChange(productsPage + 1)
                          }
                          disabled={
                            productsPage === productsData.pagination.pages
                          }
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
        </TabsContent>
      </Tabs>

      {/* Image View Dialog */}
      <Dialog open={!!viewImageUrl} onOpenChange={() => setViewImageUrl(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] p-0">
          {viewImageUrl && (
            <img
              src={viewImageUrl}
              alt="Full size photo"
              className="w-full h-full object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
