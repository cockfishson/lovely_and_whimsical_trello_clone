import { Request, Response } from "express";
import { TrelloServices } from "../services/trelloServices.js";

export class TrelloController {
    public static async getAllBoards(req: Request, res: Response): Promise<void> {
        const boards = await TrelloServices.getAllBoards();
        res.status(200).json({ success: true, data: boards });
    }

    public static async createBoard(req: Request, res: Response): Promise<void> {
        const { title } = req.body;
        const newBoard = await TrelloServices.createBoard(title);
        res.status(201).json(newBoard);
    }

    public static async changeBoardTitle(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id);
        const { title } = req.body;
        const updatedBoard = await TrelloServices.changeBoardTitle(id, title);
        res.status(200).json(updatedBoard);
    }

    public static async deleteBoard(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id);
        await TrelloServices.deleteBoard(id);
        res.status(204).send();
    }

    public static async updateBoardLists(req:Request, res:Response):Promise<void>{
                const id = parseInt(req.params.id);
                const { lists } = req.body;
                await TrelloServices.updateBoardLists(id, lists);
                res.status(200).json({ message: "Lists updated successfully" });
    }

    public static async getBoardContent(req: Request, res: Response): Promise<void> {
        const boardId = parseInt(req.params.id);
        const lists = await TrelloServices.getBoardContent(boardId);
        res.status(200).json(lists);
    }

    public static async createList(req: Request, res: Response): Promise<void> {
        const boardId = parseInt(req.params.id);
        const { title, position } = req.body;
        const newList = await TrelloServices.createList(boardId, { title, position });
        res.status(201).json(newList);
    }

    public static async updateList(req: Request, res: Response): Promise<void> {
        const listId = parseInt(req.params.listId);
        const { title, position } = req.body;
        const updatedList = await TrelloServices.updateList(listId, { title, position });
        res.status(200).json(updatedList);
    }

    public static async deleteList(req: Request, res: Response): Promise<void> {
        const listId = parseInt(req.params.listId);
        await TrelloServices.deleteList(listId);
        res.status(204).send();
    }

    public static async createCard(req: Request, res: Response): Promise<void> {
        const listId = parseInt(req.params.listId);
        const { title, description, position } = req.body;
        const newCard = await TrelloServices.createCard(listId, { title, description, position });
        res.status(201).json(newCard);
    }

    public static async updateCard(req: Request, res: Response): Promise<void> {
        const cardId = parseInt(req.params.cardId);
      
        if (isNaN(cardId)) {
            res.status(400).json({ error: "Invalid listId or cardId" });
        }
      
        const { list_id, title, description, position } = req.body;
        const updatedCard = await TrelloServices.updateCard(cardId, {
          listId: list_id, 
          title,
          description,
          position        
        });
        res.status(200).json(updatedCard);
    }
      

    public static async deleteCard(req: Request, res: Response): Promise<void> {
        const cardId = parseInt(req.params.cardId);
        await TrelloServices.deleteCard(cardId);
        res.status(204).send();
    }

    public static async getActivityLog(req: Request, res: Response): Promise<void> {
        const logs = await TrelloServices.getActivityLog();
        res.status(200).json(logs);
    }

    public static async createActivityLog(req: Request, res: Response): Promise<void> {
        const { user_name_and_surname, action_type, action_details } = req.body;
        const log = await TrelloServices.createActivityLog({ user_name_and_surname, action_type, action_details });
        res.status(201).json(log);
    }
}
