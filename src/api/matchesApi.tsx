import axios from 'axios';
import { Match } from '../models/MatchModel';

// Функция для получения матчей с сервера
export const getMatches = async (): Promise<Match[]> => {
    try {
        const response = await axios.get('http://192.168.1.66:3004/api/matches');
        console.log(response.data)
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error('Ошибка при получении матчей:', error.message); // Выводим сообщение об ошибке в консоль
        } else {
            console.error('Произошла непредвиденная ошибка', error);
        }
        throw error; // Пробрасываем ошибку для обработки в компоненте
    }
};
