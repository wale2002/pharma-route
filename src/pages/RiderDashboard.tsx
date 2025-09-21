import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Truck, MapPin, Clock, Package, CheckCircle, ArrowRight, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { orderApi, Order } from '@/lib/mockApi';

export default function RiderDashboard() {
  const [availableOrders, setAvailableOrders] = useState<Order[]>([]);
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [available, assigned] = await Promise.all([
        orderApi.getAvailableOrders(),
        orderApi.getUserOrders()
      ]);
      setAvailableOrders(available);
      setMyOrders(assigned);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleAcceptOrder = async (orderId: string) => {
    setLoading(true);
    try {
      await orderApi.acceptOrder(orderId);
      toast({
        title: 'Order Accepted',
        description: 'You have successfully accepted this delivery order.',
      });
      loadData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to accept order. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, status: Order['status']) => {
    setLoading(true);
    try {
      await orderApi.updateOrderStatus(orderId, status);
      
      const statusMessages = {
        picked_up: 'Order marked as picked up from pharmacy.',
        in_transit: 'Order marked as in transit to destination.',
        delivered: 'Order marked as delivered successfully!'
      };
      
      toast({
        title: 'Status Updated',
        description: statusMessages[status as keyof typeof statusMessages] || 'Order status updated.',
      });
      loadData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update status. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-warning text-warning-foreground';
      case 'assigned':
        return 'bg-accent text-accent-foreground';
      case 'picked_up':
        return 'bg-primary text-primary-foreground';
      case 'in_transit':
        return 'bg-primary text-primary-foreground';
      case 'delivered':
        return 'bg-success text-success-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getNextStatus = (currentStatus: Order['status']) => {
    switch (currentStatus) {
      case 'assigned':
        return 'picked_up';
      case 'picked_up':
        return 'in_transit';
      case 'in_transit':
        return 'delivered';
      default:
        return null;
    }
  };

  const getNextStatusLabel = (currentStatus: Order['status']) => {
    switch (currentStatus) {
      case 'assigned':
        return 'Mark as Picked Up';
      case 'picked_up':
        return 'Mark as In Transit';
      case 'in_transit':
        return 'Mark as Delivered';
      default:
        return null;
    }
  };

  const calculateDistance = () => {
    // Mock distance calculation
    return (Math.random() * 10 + 1).toFixed(1);
  };

  const estimatedEarnings = myOrders
    .filter(order => order.status === 'delivered')
    .reduce((total, order) => total + (order.totalAmount * 0.15), 0); // 15% commission

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Rider Dashboard</h1>
          <p className="text-muted-foreground">Accept orders and manage your deliveries</p>
        </div>
        
        <Card className="bg-gradient-to-r from-accent/10 to-primary/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-success" />
              <div>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <p className="text-2xl font-bold text-success">${estimatedEarnings.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="available" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="available">
            Available Orders ({availableOrders.length})
          </TabsTrigger>
          <TabsTrigger value="my-orders">
            My Orders ({myOrders.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="available">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Available Orders
              </CardTitle>
              <CardDescription>
                Browse and accept delivery orders in your area
              </CardDescription>
            </CardHeader>
            <CardContent>
              {availableOrders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No available orders at the moment.</p>
                  <p className="text-sm text-muted-foreground mt-2">Check back soon for new delivery opportunities!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {availableOrders.map(order => (
                    <div key={order.id} className="border rounded-lg p-6 space-y-4 hover:shadow-medium transition-shadow">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">Order #{order.id.slice(-6)}</h3>
                          <p className="text-sm text-muted-foreground">
                            Created {new Date(order.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-success">${(order.totalAmount * 0.15).toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">Estimated Earnings</p>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Pickup Location:</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4 text-secondary" />
                              MediCare Central Pharmacy
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Delivery Address:</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4 text-primary" />
                              {order.deliveryAddress}
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Items ({order.items.length}):</p>
                            <div className="space-y-1">
                              {order.items.slice(0, 2).map((item, index) => (
                                <div key={index} className="text-sm text-muted-foreground">
                                  • {item.productName} (x{item.quantity})
                                </div>
                              ))}
                              {order.items.length > 2 && (
                                <div className="text-sm text-muted-foreground">
                                  +{order.items.length - 2} more items
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Distance:</p>
                            <p className="text-sm text-muted-foreground">{calculateDistance()} km</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t">
                        <Badge variant="outline" className={getStatusColor(order.status)}>
                          {order.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                        
                        <Button
                          onClick={() => handleAcceptOrder(order.id)}
                          disabled={loading}
                          className="bg-gradient-primary hover:opacity-90"
                        >
                          <Truck className="h-4 w-4 mr-2" />
                          Accept Order
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="my-orders">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                My Orders
              </CardTitle>
              <CardDescription>
                Manage your assigned deliveries and update order status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {myOrders.length === 0 ? (
                <div className="text-center py-8">
                  <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No assigned orders yet.</p>
                  <p className="text-sm text-muted-foreground mt-2">Accept orders from the Available Orders tab to get started!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myOrders.map(order => {
                    const nextStatus = getNextStatus(order.status);
                    const nextStatusLabel = getNextStatusLabel(order.status);
                    
                    return (
                      <div key={order.id} className="border rounded-lg p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">Order #{order.id.slice(-6)}</h3>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <Badge variant="outline" className={getStatusColor(order.status)}>
                            {order.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div className="space-y-1">
                              <p className="text-sm font-medium">Pickup:</p>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4 text-secondary" />
                                MediCare Central Pharmacy
                              </div>
                            </div>
                            
                            <div className="space-y-1">
                              <p className="text-sm font-medium">Delivery:</p>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4 text-primary" />
                                {order.deliveryAddress}
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="space-y-1">
                              <p className="text-sm font-medium">Earnings:</p>
                              <p className="text-lg font-bold text-success">${(order.totalAmount * 0.15).toFixed(2)}</p>
                            </div>
                            
                            <div className="space-y-1">
                              <p className="text-sm font-medium">Items:</p>
                              <div className="text-sm text-muted-foreground">
                                {order.items.length} item(s) • ${order.totalAmount.toFixed(2)} total
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {order.status !== 'delivered' && nextStatus && nextStatusLabel && (
                          <div className="flex gap-3 pt-4 border-t">
                            <Button
                              onClick={() => handleUpdateStatus(order.id, nextStatus)}
                              disabled={loading}
                              className="bg-primary hover:bg-primary/90"
                            >
                              <ArrowRight className="h-4 w-4 mr-2" />
                              {nextStatusLabel}
                            </Button>
                            
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" onClick={() => setSelectedOrder(order)}>
                                  View Details
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Order Details</DialogTitle>
                                  <DialogDescription>
                                    Complete information for Order #{order.id.slice(-6)}
                                  </DialogDescription>
                                </DialogHeader>
                                
                                {selectedOrder && (
                                  <div className="space-y-4">
                                    <div className="space-y-2">
                                      <p className="font-medium">Items to Deliver:</p>
                                      <div className="space-y-2">
                                        {selectedOrder.items.map((item, index) => (
                                          <div key={index} className="flex justify-between p-2 bg-muted rounded">
                                            <span>{item.productName}</span>
                                            <span>Qty: {item.quantity} • ${item.price}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <p className="font-medium">Delivery Information:</p>
                                      <div className="p-3 bg-muted rounded">
                                        <p className="text-sm">{selectedOrder.deliveryAddress}</p>
                                      </div>
                                    </div>
                                    
                                    <div className="flex justify-between items-center pt-4 border-t">
                                      <span className="font-medium">Total Order Value:</span>
                                      <span className="text-lg font-bold">${selectedOrder.totalAmount.toFixed(2)}</span>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                          </div>
                        )}
                        
                        {order.status === 'delivered' && (
                          <div className="bg-success/10 border border-success/20 rounded-lg p-3">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-5 w-5 text-success" />
                              <span className="font-medium text-success">Delivery Completed</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}