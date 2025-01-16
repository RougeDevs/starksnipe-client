// pages/api/log-error.js
import type { NextApiRequest, NextApiResponse } from "next";
export default function handler(req:NextApiRequest, res:NextApiResponse) {
    if (req.method === "POST") {
      const { error } = req.body;
      console.log(error,'err')
      console.error("Client-side error logged to the terminal:", error);
      res.status(200).json({ message: "Error logged successfully" });
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  }
  