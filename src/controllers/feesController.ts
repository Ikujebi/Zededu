import { Request, Response } from "express";
import { FeeModel } from "../models/feesModel";

export const createFee = async (req: Request, res: Response) => {
  try {
    const { name, amount, description, school_id } = req.body;
    const fee = await FeeModel.createFee(name, amount, description, school_id);
    res.status(201).json(fee);
  } catch (err) {
    console.error("createFee:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const listFees = async (req: Request, res: Response) => {
  try {
    const { school_id } = req.query;
    const fees = await FeeModel.getFees(Number(school_id));
    res.json(fees);
  } catch (err) {
    console.error("listFees:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateFee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, amount, description } = req.body;
    const fee = await FeeModel.updateFee(Number(id), name, amount, description);
    res.json(fee);
  } catch (err) {
    console.error("updateFee:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteFee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await FeeModel.deleteFee(Number(id));
    res.json({ message: "Fee deleted" });
  } catch (err) {
    console.error("deleteFee:", err);
    res.status(500).json({ message: "Server error" });
  }
};
