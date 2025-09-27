// pages/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Stethoscope, Pill, Truck, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "clinic" as "clinic" | "pharmacy" | "rider",
    organization: "",
    address: "",
    phone: "",
  });

  const { login, register, loading } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter email and password",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isRegister) {
        if (
          !formData.name ||
          !formData.address ||
          !formData.phone ||
          !formData.role
        ) {
          toast({
            title: "Error",
            description: "Please fill all required fields",
            variant: "destructive",
          });
          return;
        }
        await register({
          email,
          password,
          ...formData,
        });
        toast({
          title: "Account created successfully!",
          description: "Welcome to MediLink. Redirecting to dashboard...",
        });
        // Optionally auto-login after register
        await login(email, password);
      } else {
        await login(email, password);
        toast({
          title: "Welcome back!",
          description: "You have been logged in successfully.",
        });
      }
      // Delay navigation slightly to allow state update
      setTimeout(() => navigate("/"), 500);
    } catch (error) {
      console.error("Auth error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  const demoCredentials = [
    {
      role: "clinic",
      email: "clinic@medilink.com",
      icon: Stethoscope,
      color: "text-primary",
    },
    {
      role: "pharmacy",
      email: "pharmacy@medilink.com",
      icon: Pill,
      color: "text-secondary",
    },
    {
      role: "rider",
      email: "rider@medilink.com",
      icon: Truck,
      color: "text-accent",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 inline-block mb-4">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <div className="bg-white/20 rounded-lg p-2">
                <Stethoscope className="h-8 w-8 text-white" />
              </div>
              MediLink
            </h1>
          </div>
          <p className="text-white/80 text-lg">
            Connecting Healthcare • Pharmacy • Delivery
          </p>
        </div>

        {/* Auth Form */}
        <Card className="bg-white/95 backdrop-blur-md border-white/20 shadow-strong">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-foreground">
              {isRegister ? "Create Account" : "Welcome Back"}
            </CardTitle>
            <CardDescription>
              {isRegister
                ? "Join the MediLink network today"
                : "Sign in to your MediLink account"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Name/Organization</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="Enter your name or organization"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <select
                      id="role"
                      aria-label="Role"
                      value={formData.role}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          role: e.target.value as
                            | "clinic"
                            | "pharmacy"
                            | "rider",
                        }))
                      }
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      required
                    >
                      <option value="clinic">Clinic/Hospital</option>
                      <option value="pharmacy">Pharmacy</option>
                      <option value="rider">Delivery Rider</option>
                    </select>
                  </div>

                  {formData.role !== "rider" && (
                    <div className="space-y-2">
                      <Label htmlFor="organization">Organization</Label>
                      <Input
                        id="organization"
                        value={formData.organization}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            organization: e.target.value,
                          }))
                        }
                        placeholder="Organization name"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          address: e.target.value,
                        }))
                      }
                      placeholder="Full address"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      placeholder="+1-555-0000"
                      required
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading
                  ? "Please wait..."
                  : isRegister
                  ? "Create Account"
                  : "Sign In"}
              </Button>
            </form>

            <div className="text-center">
              <Button
                variant="link"
                onClick={() => setIsRegister(!isRegister)}
                className="text-sm"
              >
                {isRegister
                  ? "Already have an account? Sign in"
                  : "Need an account? Register here"}
              </Button>
            </div>

            {!isRegister && (
              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground text-center mb-3">
                  Demo Accounts (password: password123)
                </p>
                <div className="grid gap-2">
                  {demoCredentials.map(({ role, email, icon: Icon, color }) => (
                    <Button
                      key={role}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEmail(email);
                        setPassword("password123");
                      }}
                      className="justify-start"
                    >
                      <Icon className={`h-4 w-4 mr-2 ${color}`} />
                      {role.charAt(0).toUpperCase() + role.slice(1)} Demo
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
