import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, Plus, Package, Clock, CheckCircle, XCircle, Truck, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { requestApi, productApi, DrugRequest, Product } from '@/lib/mockApi';

export default function ClinicDashboard() {
  const [requests, setRequests] = useState<DrugRequest[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const [requestType, setRequestType] = useState<'photo' | 'inventory'>('photo');
  const [selectedProducts, setSelectedProducts] = useState<{ productId: string; quantity: number }[]>([]);
  
  const { toast } = useToast();

  // Form data
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [patientInfo, setPatientInfo] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [userRequests, inventory] = await Promise.all([
        requestApi.getUserRequests(),
        productApi.getInventory()
      ]);
      setRequests(userRequests);
      setProducts(inventory);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
    }
  };

  const submitPhotoRequest = async () => {
    if (!photoFile || !deliveryAddress) {
      toast({
        title: 'Missing Information',
        description: 'Please upload a photo and provide delivery address.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      // Convert file to base64 for mock API
      const reader = new FileReader();
      reader.onload = async () => {
        const photoUrl = reader.result as string;
        await requestApi.submitPhotoRequest({
          photoUrl,
          deliveryAddress,
          patientInfo
        });
        
        toast({
          title: 'Request Submitted',
          description: 'Your photo request has been sent to the pharmacy for review.',
        });
        
        setIsNewRequestOpen(false);
        resetForm();
        loadData();
      };
      reader.readAsDataURL(photoFile);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit request. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const submitInventoryRequest = async () => {
    if (selectedProducts.length === 0 || !deliveryAddress) {
      toast({
        title: 'Missing Information',
        description: 'Please select products and provide delivery address.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      await requestApi.submitInventoryRequest({
        selectedProducts,
        deliveryAddress,
        patientInfo
      });
      
      toast({
        title: 'Request Submitted',
        description: 'Your inventory request has been sent to the pharmacy.',
      });
      
      setIsNewRequestOpen(false);
      resetForm();
      loadData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit request. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setPhotoFile(null);
    setDeliveryAddress('');
    setPatientInfo('');
    setSelectedProducts([]);
    setRequestType('photo');
  };

  const updateProductQuantity = (productId: string, quantity: number) => {
    setSelectedProducts(prev => {
      const existing = prev.find(p => p.productId === productId);
      if (existing) {
        if (quantity === 0) {
          return prev.filter(p => p.productId !== productId);
        }
        return prev.map(p => p.productId === productId ? { ...p, quantity } : p);
      } else if (quantity > 0) {
        return [...prev, { productId, quantity }];
      }
      return prev;
    });
  };

  const getStatusIcon = (status: DrugRequest['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-warning" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'assigned':
      case 'picked_up':
      case 'in_transit':
        return <Truck className="h-4 w-4 text-accent" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-success" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: DrugRequest['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-warning text-warning-foreground';
      case 'confirmed':
        return 'bg-success text-success-foreground';
      case 'rejected':
        return 'bg-destructive text-destructive-foreground';
      case 'assigned':
      case 'picked_up':
      case 'in_transit':
        return 'bg-accent text-accent-foreground';
      case 'delivered':
        return 'bg-success text-success-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Healthcare Dashboard</h1>
          <p className="text-muted-foreground">Manage your drug requests and deliveries</p>
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
                Submit a request by uploading a photo or selecting from available inventory.
              </DialogDescription>
            </DialogHeader>
            
            <Tabs value={requestType} onValueChange={(value) => setRequestType(value as any)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="photo" className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Photo Request
                </TabsTrigger>
                <TabsTrigger value="inventory" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  From Inventory
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="photo" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="photo">Upload Drug Photo</Label>
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="cursor-pointer"
                  />
                  {photoFile && (
                    <p className="text-sm text-muted-foreground">
                      Selected: {photoFile.name}
                    </p>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="inventory" className="space-y-4">
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {products.map(product => {
                    const selected = selectedProducts.find(p => p.productId === product.id);
                    return (
                      <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">{product.description}</p>
                          <p className="text-sm font-medium text-primary">${product.price}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateProductQuantity(product.id, (selected?.quantity || 0) - 1)}
                            disabled={!selected || selected.quantity <= 0}
                          >
                            -
                          </Button>
                          <span className="w-8 text-center">{selected?.quantity || 0}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateProductQuantity(product.id, (selected?.quantity || 0) + 1)}
                            disabled={product.quantity <= (selected?.quantity || 0)}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
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
                onClick={requestType === 'photo' ? submitPhotoRequest : submitInventoryRequest}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Submitting...' : 'Submit Request'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Request History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Request History
          </CardTitle>
          <CardDescription>
            Track the status of your drug requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No requests yet. Create your first request above!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map(request => (
                <div key={request.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={getStatusColor(request.status)}>
                        {getStatusIcon(request.status)}
                        {request.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <Badge variant="secondary">
                      {request.type === 'photo' ? 'Photo Request' : 'Inventory Request'}
                    </Badge>
                  </div>
                  
                  {request.type === 'inventory' && request.selectedProducts && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Requested Items:</p>
                      <div className="grid gap-2">
                        {request.selectedProducts.map((item, index) => (
                          <div key={index} className="text-sm text-muted-foreground">
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
                  
                  {request.status === 'rejected' && request.rejectionReason && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                      <p className="text-sm font-medium text-destructive">Rejection Reason:</p>
                      <p className="text-sm text-destructive/80">{request.rejectionReason}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}