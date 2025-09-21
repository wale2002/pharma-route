import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Package, Clock, CheckCircle, XCircle, Image, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { requestApi, productApi, DrugRequest, Product } from '@/lib/mockApi';

export default function PharmacyDashboard() {
  const [pendingRequests, setPendingRequests] = useState<DrugRequest[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<DrugRequest | null>(null);
  
  const { toast } = useToast();

  // Product form data
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    category: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [requests, inventory] = await Promise.all([
        requestApi.getPendingRequests(),
        productApi.getInventory()
      ]);
      setPendingRequests(requests);
      setProducts(inventory);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleConfirmRequest = async (requestId: string) => {
    setLoading(true);
    try {
      await requestApi.confirmRequest(requestId);
      toast({
        title: 'Request Confirmed',
        description: 'The request has been confirmed and an order has been created.',
      });
      loadData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to confirm request. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    if (!rejectionReason.trim()) {
      toast({
        title: 'Rejection Reason Required',
        description: 'Please provide a reason for rejecting this request.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      await requestApi.rejectRequest(requestId, rejectionReason);
      toast({
        title: 'Request Rejected',
        description: 'The request has been rejected.',
      });
      setRejectionReason('');
      setSelectedRequest(null);
      loadData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reject request. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async () => {
    if (!productForm.name || !productForm.price || !productForm.quantity) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      await productApi.addProduct({
        name: productForm.name,
        description: productForm.description,
        price: parseFloat(productForm.price),
        quantity: parseInt(productForm.quantity),
        category: productForm.category,
        pharmacyId: '2' // Main pharmacy ID
      });
      
      toast({
        title: 'Product Added',
        description: 'The product has been added to your inventory.',
      });
      
      setIsAddProductOpen(false);
      setProductForm({
        name: '',
        description: '',
        price: '',
        quantity: '',
        category: ''
      });
      loadData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add product. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await productApi.deleteProduct(productId);
      toast({
        title: 'Product Deleted',
        description: 'The product has been removed from your inventory.',
      });
      loadData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete product. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pharmacy Dashboard</h1>
          <p className="text-muted-foreground">Manage requests, inventory, and orders</p>
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
                  onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter product name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={productForm.description}
                  onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
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
                    onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={productForm.quantity}
                    onChange={(e) => setProductForm(prev => ({ ...prev, quantity: e.target.value }))}
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={productForm.category}
                  onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="e.g., Pain Relief, Antibiotics"
                />
              </div>
              
              <Button onClick={handleAddProduct} disabled={loading} className="w-full">
                {loading ? 'Adding...' : 'Add Product'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="requests" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="requests">
            Pending Requests ({pendingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="inventory">
            Inventory ({products.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Pending Requests
              </CardTitle>
              <CardDescription>
                Review and process incoming drug requests from clinics
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingRequests.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No pending requests at the moment.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingRequests.map(request => (
                    <div key={request.id} className="border rounded-lg p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{request.clinicName}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(request.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <Badge variant="outline" className="bg-warning/10 text-warning">
                          {request.type === 'photo' ? 'Photo Request' : 'Inventory Request'}
                        </Badge>
                      </div>
                      
                      {request.type === 'photo' && request.photoUrl && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Uploaded Photo:</p>
                          <div className="bg-muted rounded-lg p-4 flex items-center gap-3">
                            <Image className="h-8 w-8 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              Drug identification photo uploaded
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {request.type === 'inventory' && request.selectedProducts && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Requested Items:</p>
                          <div className="bg-muted rounded-lg p-4 space-y-2">
                            {request.selectedProducts.map((item, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span>{item.productName}</span>
                                <span className="font-medium">Qty: {item.quantity}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Delivery Address:</p>
                        <p className="text-sm text-muted-foreground">{request.deliveryAddress}</p>
                      </div>
                      
                      {request.patientInfo && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Patient Information:</p>
                          <p className="text-sm text-muted-foreground">{request.patientInfo}</p>
                        </div>
                      )}
                      
                      <div className="flex gap-3 pt-4">
                        <Button
                          onClick={() => handleConfirmRequest(request.id)}
                          disabled={loading}
                          className="bg-success hover:bg-success/90"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Confirm & Create Order
                        </Button>
                        
                        <Dialog>
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
                                Please provide a reason for rejecting this request.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <Textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="Enter rejection reason (e.g., out of stock, invalid prescription, etc.)"
                              />
                              <div className="flex gap-3">
                                <Button
                                  variant="destructive"
                                  onClick={() => selectedRequest && handleRejectRequest(selectedRequest.id)}
                                  disabled={loading}
                                >
                                  Reject Request
                                </Button>
                                <Button variant="outline" onClick={() => setSelectedRequest(null)}>
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Inventory Management
              </CardTitle>
              <CardDescription>
                Manage your pharmacy's drug inventory
              </CardDescription>
            </CardHeader>
            <CardContent>
              {products.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No products in inventory. Add your first product!</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {products.map(product => (
                    <div key={product.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">{product.description}</p>
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
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-primary">${product.price}</span>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Stock</p>
                          <p className={`font-medium ${product.quantity < 10 ? 'text-warning' : 'text-success'}`}>
                            {product.quantity} units
                          </p>
                        </div>
                      </div>
                      
                      {product.quantity < 10 && (
                        <div className="bg-warning/10 border border-warning/20 rounded-lg p-2">
                          <p className="text-xs text-warning font-medium">Low Stock Warning</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}