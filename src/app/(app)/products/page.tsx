import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/layout/page-header";
import { getCurrentUserOrRedirect } from "@/lib/auth";
import { listProducts } from "@/lib/services/product.service";

type ProductListRow = {
  id: string;
  name: string;
  price: number | null;
  currency: string;
  ai_score: number | null;
  campaigns: { name: string } | null;
};

export default async function ProductsPage() {
  const { supabase } = await getCurrentUserOrRedirect();
  const products = (await listProducts(
    supabase,
  )) as unknown as ProductListRow[];

  return (
    <>
      <PageHeader
        title="Products"
        description="Track affiliate products and product-level opportunity signals."
        action={
          <Button asChild>
            <Link href="/products/new">
              <Plus className="h-4 w-4" />
              New product
            </Link>
          </Button>
        }
      />
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Campaign</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>AI score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(products ?? []).map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Link
                      className="font-medium text-primary"
                      href={`/products/${product.id}`}
                    >
                      {product.name}
                    </Link>
                  </TableCell>
                  <TableCell>{product.campaigns?.name ?? "None"}</TableCell>
                  <TableCell>
                    {product.price
                      ? `${product.currency} ${product.price}`
                      : "Not set"}
                  </TableCell>
                  <TableCell>{product.ai_score ?? "Not scored"}</TableCell>
                </TableRow>
              ))}
              {!products?.length ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground"
                  >
                    No products yet.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
