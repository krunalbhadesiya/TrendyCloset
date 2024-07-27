"use client"

import { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function AddProduct() {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [totalStock, setTotalStock] = useState<number | undefined>(undefined);
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [image, setImage] = useState<File | null>(null);
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);

  const handleImageUpload = async () => {
    if (!image) return;

    const filename = `${Date.now()}-${image.name}`;
    const formData = new FormData();
    formData.append('file', image);

    const response = await fetch(`${process.env.BASE_URL}/upload?filename=${encodeURIComponent(filename)}`, {
      method: 'POST',
      body: formData,
    });
    const result = await response.json();
    if (result.success) {
      setUploadUrl(result.url);
    } else {
      console.error(result.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleImageUpload();

    const productData = {
      name: productName,
      description,
      totalStock,
      size,
      color,
      price,
      imageUrl: uploadUrl,
    };

    const response = await fetch(`${process.env.BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    const result = await response.json();
    if (result.success) {
      alert('Product added successfully!');
    } else {
      alert('Error adding product');
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Add New Product</h1>
        <p className="text-muted-foreground">Fill out the form below to add a new product to your store.</p>
      </div>
      <form className="grid gap-6" onSubmit={handleSubmit}>
        <div className="grid gap-2">
          <Label htmlFor="name">Product Name</Label>
          <Input id="name" type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Enter product name" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter product description" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="totalStock">Total Stock</Label>
          <Input id="totalStock" type="number" value={totalStock} onChange={(e) => setTotalStock(Number(e.target.value))} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="grid gap-2">
            <Label htmlFor="size">Size</Label>
            <div>
              <Select onValueChange={(value) => setSize(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="s">Small</SelectItem>
                  <SelectItem value="m">Medium</SelectItem>
                  <SelectItem value="l">Large</SelectItem>
                  <SelectItem value="xl">X-Large</SelectItem>
                  <SelectItem value="xxl">XX-Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="color">Color</Label>
            <div>
              <Select onValueChange={(value) => setColor(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="black">Black</SelectItem>
                  <SelectItem value="white">White</SelectItem>
                  <SelectItem value="blue">Blue</SelectItem>
                  <SelectItem value="red">Red</SelectItem>
                  <SelectItem value="green">Green</SelectItem>
                  <SelectItem value="gray">Gray</SelectItem>
                  <SelectItem value="orange">Orange</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="grid gap-2">
            <Label htmlFor="price">Price</Label>
            <Input id="price" type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} placeholder="Enter price" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="image">Photo</Label>
            <Input id="image" type="file" onChange={(e) => e.target.files && setImage(e.target.files[0])} />
          </div>
        </div>
        <Button type="submit" className="w-full">
          Save Product
        </Button>
      </form>
    </div>
  );
}
