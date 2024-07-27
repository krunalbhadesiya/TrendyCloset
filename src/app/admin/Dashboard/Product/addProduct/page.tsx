"use client";

import { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type FormData = {
  name: string;
  description: string;
  totalStock: number | undefined;
  size: string;
  color: string;
  price: number | undefined;
  imageUrl: string | null;
};

export default function AddProduct() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    totalStock: undefined,
    size: '',
    color: '',
    price: undefined,
    imageUrl: null,
  });
  const [image, setImage] = useState<File | null>(null);

  const handleImageUpload = async (): Promise<string | null> => {
    if (!image) return null;

    const filename = `${Date.now()}-${image.name}`;
    const url = `https://trendy-closet.vercel.app/api/upload?filename=${filename}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/octet-stream',
        },
        body: await image.arrayBuffer(), // Convert the file to ArrayBuffer
      });

      const result = await response.json();
      if (result.success) {
        return result.url;
      } else {
        console.error(result.message);
        return null;
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const uploadedImageUrl = await handleImageUpload();

    const finalFormData = {
      ...formData,
      imageUrl: uploadedImageUrl,
    };

    try {
      const response = await fetch(`${process.env.BASE_URL}products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalFormData),
      });
      const result = await response.json();
      if (result.success) {
        alert('Product added successfully!');
        setFormData({
          name: '',
          description: '',
          totalStock: undefined,
          size: '',
          color: '',
          price: undefined,
          imageUrl: null,
        });
        setImage(null);
      } else {
        alert('Error adding product');
      }
    } catch (error) {
      console.error('Error submitting product:', error);
      alert('Error submitting product');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof FormData) => (value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
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
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter product name"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange as React.ChangeEventHandler<HTMLTextAreaElement>}
            placeholder="Enter product description"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="totalStock">Total Stock</Label>
          <Input
            id="totalStock"
            name="totalStock"
            type="number"
            value={formData.totalStock || ''}
            onChange={handleInputChange}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="grid gap-2">
            <Label htmlFor="size">Size</Label>
            <Select onValueChange={handleSelectChange('size')}>
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
          <div className="grid gap-2">
            <Label htmlFor="color">Color</Label>
            <Select onValueChange={handleSelectChange('color')}>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="grid gap-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              name="price"
              type="number"
              value={formData.price || ''}
              onChange={handleInputChange}
              placeholder="Enter price"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="image">Photo</Label>
            <Input
              id="image"
              name="image"
              type="file"
              onChange={(e) => e.target.files && setImage(e.target.files[0])}
            />
          </div>
        </div>
        <Button type="submit" className="w-full">
          Save Product
        </Button>
      </form>
    </div>
  );
}
