import express from "express";

export interface AuthenticatedRequest extends express.Request {
  user: { id: string; name: string };
}
