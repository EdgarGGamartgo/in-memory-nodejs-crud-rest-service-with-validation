import express, { Request, Response } from 'express'
import { body, param } from 'express-validator'
import { BadRequestError, validateRequest } from '@oregtickets/common'
import { User } from './../models/User'
import { v4 as uuidv4 } from 'uuid';

const router = express.Router()

router.get('/api/users/:mode',
    [
        param('mode')
            .trim()
            .notEmpty()
            .isString()
            .custom(mode => {
                if (mode === 'true') {
                    return true
                } else if (mode === 'false') {
                    return true
                } else if (mode === 'all') {
                    return true
                } else {
                    throw new BadRequestError('mode must be true, false or all')
                }
            })
            .withMessage('You must supply a valid mode')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { mode } = req.params;
        if (mode === 'true') {
            const users = User.filter(u => u.isDeleted === true)
            res.status(200).send(users);
        } else if (mode === 'false') {
            const users = User.filter(u => u.isDeleted === false)
            res.status(200).send(users);
        } else if (mode === 'all') {
            res.status(200).send(User);
        }
    })

router.get('/api/user-auto-suggest', async (req: Request, res: Response) => {
    res.status(200).send('auto-suggest')
})

router.get('/api/user/:id',
    [
        param('id')
            .trim()
            .notEmpty()
            .isString()
            .withMessage('You must supply a valid UUID')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const user = User.find(u => u.id === id && !u.isDeleted);
        if (user) {
            res.status(200).send(user);
        }
        throw new BadRequestError('User does not exist!!!');
    })

router.get('/api/user/auto-suggest', async (req: Request, res: Response) => {
    res.status(200).send('auto-suggest')
})

router.post('/api/user', [
    body('login')
        .trim()
        .notEmpty()
        .isString()
        .withMessage('You must supply login'),
    body('password')
        .trim()
        .notEmpty()
        .isString()
        .withMessage('You must supply a password'),
    body('age')
        .trim()
        .notEmpty()
        .isNumeric()
        .custom(age => {
            if (age >= 4 && age <= 130) {
                return true
            } else {
                throw new BadRequestError('age must be between 4 and 130')
            }
        })
        .withMessage('You must supply age')
],
    validateRequest, async (req: Request, res: Response) => {
        const { login, password, age } = req.body;
        const user = {
            id: uuidv4(),
            login,
            password,
            age: +age,
            isDeleted: false
        }
        User.push(user)
        res.status(201).send(user)
    })

router.put('/api/user', [
    body('id')
        .trim()
        .notEmpty()
        .isString()
        .withMessage('You must supply an id'),
    body('password')
        .trim()
        .notEmpty()
        .isString()
        .withMessage('You must supply a password'),
    body('login')
        .trim()
        .notEmpty()
        .isString()
        .withMessage('You must supply login'),
    body('age')
        .trim()
        .notEmpty()
        .isNumeric()
        .custom(age => {
            if (age >= 4 && age <= 130) {
                return true
            } else {
                throw new BadRequestError('age must be between 4 and 130')
            }
        })
        .withMessage('You must supply age')
],
    validateRequest, async (req: Request, res: Response) => {
        const { login, password, age, id } = req.body;
        let user = User.find(u => u.id === id && !u.isDeleted);
        if (user) {
            user = {
                login, password, age: +age, id, isDeleted: false
            }
            res.status(200).send(user);
        }
        throw new BadRequestError('User does not exist!!!');
    })

router.delete('/api/user/:id',
    [
        param('id')
            .trim()
            .notEmpty()
            .isString()
            .withMessage('You must supply a valid UUID')
    ], async (req: Request, res: Response) => {
        const { id } = req.params;
        let userIndex = User.findIndex((u => u.id === id && !u.isDeleted));
        if (userIndex !== -1) {
            User[userIndex].isDeleted = true
            res.status(200).send(User[userIndex]);
        }
        throw new BadRequestError('User does not exist!!!')
    })

export { router as UserController }
