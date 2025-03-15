"use client"

import { useState } from "react"
import { ShoppingCart, Clock, Gift, Award, Tag, Search, Wallet, Coins } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type Product = {
  id: string
  name: string
  description: string
  points: number
  category: "vouchers" | "time_off" | "swag" | "experience"
  image: string
  stock: number
}

export function Marketplace() {
  const [balance, setBalance] = useState(800)
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [sortOption, setSortOption] = useState<string>("price_asc")
  const [purchaseSuccess, setPurchaseSuccess] = useState(false)

  const products: Product[] = [
    {
      id: "1",
      name: "Café da Manhã com CEO",
      description: "Café grátis na conta do CEO",
      points: 50,
      category: "vouchers",
      image: "https://ui.shadcn.com/placeholder.svg?height=100&width=100",
      stock: 10,
    },
    {
      id: "2",
      name: "YoogaTimer Extra",
      description: "Ganhe um intervalo adicional de 15 minutos no yoogatimer",
      points: 100,
      category: "time_off",
      image: "https://ui.shadcn.com/placeholder.svg?height=100&width=100",
      stock: 5,
    },
    {
      id: "3",
      name: "Camiseta da empresa",
      description: "Camiseta da marca da empresa edição especial",
      points: 200,
      category: "swag",
      image: "https://ui.shadcn.com/placeholder.svg?height=100&width=100",
      stock: 15,
    },
    {
      id: "4",
      name: "Almoço VIP",
      description: "Almoce com lideranças do time",
      points: 500,
      category: "experiences",
      image: "https://ui.shadcn.com/placeholder.svg?height=100&width=100",
      stock: 2,
    },
    {
      id: "5",
      name: "Ingressos de cinema",
      description: "Dois ingressos para qualquer filme",
      points: 150,
      category: "vouchers",
      image: "https://ui.shadcn.com/placeholder.svg?height=100&width=100",
      stock: 8,
    },
    {
      id: "6",
      name: "Saia 1 hora mais cedo",
      description: "Saia do trabalho 1 hora mais cedo no dia de sua escolha",
      points: 150,
      category: "time_off",
      image: "https://ui.shadcn.com/placeholder.svg?height=100&width=100",
      stock: 10,
    },
    {
      id: "7",
      name: "Fones de ouvido sem fio",
      description: "Fones de ouvido sem fio de alta qualidade",
      points: 400,
      category: "swag",
      image: "https://ui.shadcn.com/placeholder.svg?height=100&width=100",
      stock: 3,
    },
    {
      id: "8",
      name: "Almoço de Equipe",
      description: "Almoço para toda a sua equipe",
      points: 300,
      category: "experiences",
      image: "https://ui.shadcn.com/placeholder.svg?height=100&width=100",
      stock: 4,
    },
  ]

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "vouchers":
        return <Tag className="h-5 w-5" />
      case "time_off":
        return <Clock className="h-5 w-5" />
      case "swag":
        return <Gift className="h-5 w-5" />
      case "experiences":
        return <Award className="h-5 w-5" />
      default:
        return <Tag className="h-5 w-5" />
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "vouchers":
        return "Vouchers"
      case "time_off":
        return "YoogaTimer"
      case "swag":
        return "Presentes"
      case "experiences":
        return "Experiências"
      default:
        return category
    }
  }

  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.product.id === product.id)

    if (existingItem) {
      setCart(cart.map((item) => (item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setCart([...cart, { product, quantity: 1 }])
    }
  }

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.product.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCart(cart.map((item) => (item.product.id === productId ? { ...item, quantity } : item)))
  }

  const getTotalPoints = () => {
    return cart.reduce((total, item) => total + item.product.points * item.quantity, 0)
  }

  const handleCheckout = () => {
    const totalPoints = getTotalPoints()

    if (totalPoints <= balance) {
      setBalance(balance - totalPoints)
      setCart([])
      setPurchaseSuccess(true)
      setTimeout(() => setPurchaseSuccess(false), 5000)
    }
  }

  const filteredProducts = products
    .filter(
      (product) =>
        (categoryFilter === "all" || product.category === categoryFilter) &&
        (product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())),
    )
    .sort((a, b) => {
      switch (sortOption) {
        case "price_asc":
          return a.points - b.points
        case "price_desc":
          return b.points - a.points
        case "name_asc":
          return a.name.localeCompare(b.name)
        case "name_desc":
          return b.name.localeCompare(a.name)
        default:
          return 0
      }
    })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Marketplace</h2>
          <p className="text-muted-foreground">Gaste seus SuCoins conquistados com muito esforço em recompensas</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="bg-primary/10 px-3 py-1 rounded-md flex items-center">
            <Wallet className="h-5 w-5 mr-2 text-primary" />
            <span className="font-medium">SU$: {balance} sucoins</span>
          </div>
          <Dialog open={cart.length > 0} onOpenChange={(open) => (open ? null : setCart([]))}>
            <DialogTrigger asChild>
              <Button variant="outline" className="relative">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Cart
                {cart.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                    {cart.length}
                  </Badge>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Your Cart</DialogTitle>
                <DialogDescription>Review your items before checkout</DialogDescription>
              </DialogHeader>

              {cart.length === 0 ? (
                <div className="py-6 text-center">
                  <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="mt-2">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.product.image || "https://ui.shadcn.com/placeholder.svg"}
                          alt={item.product.name}
                          className="h-12 w-12 rounded-md object-cover"
                        />
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-muted-foreground">{item.product.points} points each</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        >
                          -
                        </Button>
                        <span>{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  ))}

                  <Separator />

                  <div className="flex justify-between items-center font-medium">
                    <span>Total</span>
                    <span>{getTotalPoints()} points</span>
                  </div>

                  {getTotalPoints() > balance && (
                    <Alert variant="destructive">
                      <AlertTitle>Insufficient points</AlertTitle>
                      <AlertDescription>
                        You need {getTotalPoints() - balance} more points to complete this purchase.
                      </AlertDescription>
                    </Alert>
                  )}

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setCart([])}>
                      Clear Cart
                    </Button>
                    <Button onClick={handleCheckout} disabled={getTotalPoints() > balance || cart.length === 0}>
                      Checkout
                    </Button>
                  </DialogFooter>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {purchaseSuccess && (
        <Alert className="bg-green-50 border-green-200">
          <AlertTitle>Purchase Successful!</AlertTitle>
          <AlertDescription>Your items have been redeemed successfully. Check your email for details.</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-64 space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar recompensas..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Categorias</h3>
            <div className="space-y-1">
              <Button
                variant={categoryFilter === "all" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setCategoryFilter("all")}
              >
                Todas categorias
              </Button>
              <Button
                variant={categoryFilter === "vouchers" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setCategoryFilter("vouchers")}
              >
                <Tag className="mr-2 h-4 w-4" />
                Vouchers
              </Button>
              <Button
                variant={categoryFilter === "time_off" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setCategoryFilter("time_off")}
              >
                <Clock className="mr-2 h-4 w-4" />
                YoogaTimer
              </Button>
              <Button
                variant={categoryFilter === "swag" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setCategoryFilter("swag")}
              >
                <Gift className="mr-2 h-4 w-4" />
                Presentes
              </Button>
              <Button
                variant={categoryFilter === "experiences" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setCategoryFilter("experiences")}
              >
                <Award className="mr-2 h-4 w-4" />
                Experiências
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Ordenar por</h3>
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price_asc">Preço: baixo para alto</SelectItem>
                <SelectItem value="price_desc">Preço: alto para baixo</SelectItem>
                <SelectItem value="name_asc">Nome: A a Z</SelectItem>
                <SelectItem value="name_desc">Nome: Z a A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <img
                  src={product.image || "https://ui.shadcn.com/placeholder.svg"}
                  alt={product.name}
                  className="h-40 w-full object-cover"
                />
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <Badge variant="outline" className="flex items-center gap-1">
                      {getCategoryIcon(product.category)}
                      <span>{getCategoryLabel(product.category)}</span>
                    </Badge>
                  </div>
                  <CardDescription>{product.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Coins className="h-5 w-5 mr-2 text-yellow-500" />
                      <span className="font-semibold">{product.points} SU$</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{product.stock} disponível</span>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setSelectedProduct(product)
                      setIsDialogOpen(true)
                    }}
                  >
                    Detalhes
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0 || balance < product.points}
                  >
                    Adicionar
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="py-12 text-center">
              <Search className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No rewards found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedProduct && (
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{selectedProduct.name}</DialogTitle>
              <DialogDescription>{selectedProduct.description}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <img
                src={selectedProduct.image || "https://ui.shadcn.com/placeholder.svg"}
                alt={selectedProduct.name}
                className="h-48 w-full object-cover rounded-md"
              />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Categoria</p>
                  <Badge variant="outline" className="flex items-center gap-1">
                    {getCategoryIcon(selectedProduct.category)}
                    <span>{getCategoryLabel(selectedProduct.category)}</span>
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Preço</p>
                  <div className="flex items-center">
                    <Award className="h-5 w-5 mr-2 text-yellow-500" />
                    <span className="font-semibold">{selectedProduct.points} points</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Estoque</p>
                  <p>{selectedProduct.stock} available</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={selectedProduct.stock > 0 ? "default" : "secondary"}>
                    {selectedProduct.stock > 0 ? "In Stock" : "Out of Stock"}
                  </Badge>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={() => {
                  addToCart(selectedProduct)
                  setIsDialogOpen(false)
                }}
                disabled={selectedProduct.stock === 0 || balance < selectedProduct.points}
              >
                Adicionar
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}

