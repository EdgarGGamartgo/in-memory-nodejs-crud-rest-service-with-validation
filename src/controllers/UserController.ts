import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { BadRequestError, validateRequest } from '@oregtickets/common'

const router = express.Router()

router.get('/api/user/:id', async (req: Request, res: Response) => {
    res.status(200).send('api/user/:id')
})

router.get('/api/user/auto-suggest', async (req: Request, res: Response) => {
    res.status(200).send('auto-suggest')
})

router.post('/api/user', [
         body('password')
             .trim()
             .notEmpty()
             .withMessage('You must supply a password')
    ],
    validateRequest, async (req: Request, res: Response) => {
    res.status(201).send('post')
})

router.put('/api/user', [
        body('password')
            .trim()
            .notEmpty()
            .withMessage('You must supply a password')
    ],
    validateRequest, async (req: Request, res: Response) => {
    res.status(200).send('put')
})

router.delete('/api/user/:id', async (req: Request, res: Response) => {
    res.status(200).send('delete')
})

export  { router as UserController }