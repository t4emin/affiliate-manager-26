"use client";

import { useActionState } from "react";
import { testAiProvider, type AiTestState } from "@/app/actions/ai";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const initialState: AiTestState = {};

export function AiTestForm() {
  const [state, action, pending] = useActionState(testAiProvider, initialState);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,520px)_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Provider test</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={action} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="provider">Provider</Label>
              <select
                id="provider"
                name="provider"
                defaultValue="deepseek"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="deepseek">DeepSeek</option>
                <option value="openai">OpenAI</option>
                <option value="gemini">Gemini</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="prompt">Prompt</Label>
              <Textarea
                id="prompt"
                name="prompt"
                required
                placeholder="Write a short test prompt."
                className="min-h-40"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2 sm:col-span-3">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  name="model"
                  placeholder="Use provider default"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature</Label>
                <Input
                  id="temperature"
                  name="temperature"
                  type="number"
                  min="0"
                  max="2"
                  step="0.1"
                  placeholder="0.7"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="maxTokens">Max tokens</Label>
                <Input
                  id="maxTokens"
                  name="maxTokens"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="Provider default"
                />
              </div>
            </div>
            <Button type="submit" disabled={pending}>
              {pending ? "Testing..." : "Submit"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Response</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {state.provider ? (
            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <div className="rounded-md border p-3">
                <p className="text-muted-foreground">Provider</p>
                <p className="font-medium">{state.provider}</p>
              </div>
              <div className="rounded-md border p-3">
                <p className="text-muted-foreground">Model</p>
                <p className="font-medium">{state.model ?? "Not available"}</p>
              </div>
            </div>
          ) : null}
          {state.error ? (
            <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {state.error}
            </p>
          ) : null}
          {state.content ? (
            <pre className="min-h-40 whitespace-pre-wrap rounded-md border bg-secondary/40 p-4 text-sm">
              {state.content}
            </pre>
          ) : (
            <p className="text-sm text-muted-foreground">
              Submit a prompt to verify a provider.
            </p>
          )}
          {state.usage ? (
            <pre className="whitespace-pre-wrap rounded-md border bg-secondary/40 p-4 text-xs">
              {JSON.stringify(state.usage, null, 2)}
            </pre>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
