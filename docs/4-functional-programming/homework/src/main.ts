import { Either, fromPromise, ap, right, getOrElse, flatten, isRight, left } from './fp/either';
import { pipe } from './fp/utils';
import { fromNullable } from './fp/maybe';
import { ordNumber } from './fp/ord';
import { fetchClient, fetchExecutor } from './fetching';
import { ClientUser, ExecutorUser } from './types';

type Response<R> = Promise<Either<string, R>>

const getExecutor = (): Response<ExecutorUser> => fromPromise(fetchExecutor());
const getClients = (): Response<Array<ClientUser>> => {
  return fromPromise(fetchClient()).then((users) => {
    return isRight(users)
      ? {...users, right: users.right.map(item => ({...item, demands: fromNullable(item.demands)}))}
      : users;
  }).catch((err) => err);
};

export enum SortBy {
  distance = 'distance',
  reward = 'reward',
}

interface Position {
  x: number,
  y: number,
}

const calculateDistance = (executorPosition: Position, clientPosition: Position) => {
  return Math.sqrt(Math.pow(clientPosition.x - executorPosition.x, 2) + Math.pow(clientPosition.y - executorPosition.y, 2)).toFixed(3);
}
const sortByParameter = (clients: Array<ClientUser>, executor: ExecutorUser, parameter: SortBy) => {
  if (parameter === SortBy.reward) {
    return clients.sort((x, y) => ordNumber.compare(x.reward, y.reward)).reverse();
  }

  return clients.sort((x, y) => ordNumber.compare(Number(calculateDistance(executor.position, x.position)), Number(calculateDistance(executor.position, y.position))));
}
export const show = (sortBy: SortBy) => (clients: Array<ClientUser>) => (executor: ExecutorUser): Either<string, string> => {
  if (!executor.possibilities.length) return left('This executor cannot meet the demands of any client!');

  const arrayMatches = clients.reduce((acc: Array<ClientUser>, curr: ClientUser, i: number) => {
    const isMatch = curr.demands._tag === 'None' || curr.demands.value.every((item) => executor.possibilities.includes(item));
    isMatch && acc.push(clients[i]);
    return acc;
  }, [])

  if (arrayMatches.length === clients.length) return right('This executor meets all demands of all clients!');

  const defaultString = `This executor meets the demands of only ${arrayMatches.length} out of ${clients.length} clients`;
  const clientList = sortByParameter(arrayMatches, executor, sortBy).map((item) => `\nname: ${item.name}, distance: ${calculateDistance(executor.position, item.position)}, reward: ${item.reward}`);
  const sortedByRewardString = 'Available clients sorted by highest reward';
  const sorterByDistanceString = 'Available clients sorted by distance to executor'
  const result = `${defaultString}\n\n${sortBy === SortBy.reward ? sortedByRewardString : sorterByDistanceString}:${clientList}`
  return right(result);
};

export const main = (sortBy: SortBy): Promise<string> => (
  Promise
    .all([getClients(), getExecutor()]) // Fetch clients and executor
    .then(([clients, executor]) => (
      pipe(
        /**
         * Since the 'show' function takes two parameters, the value of which is inside Either
         * clients is Either<string, Array<Client>>, an executor is Either<string, Executor>. How to pass only Array<Client> and Executor to the show?
         * Either is an applicative type class, which means that we can apply each parameter by one
         */
        right(show(sortBy)), // Firstly, we need to lift our function to the Either
        ap(clients), // Apply first parameter
        ap(executor), // Apply second parameter
        flatten, // show at the end returns Either as well, so the result would be Either<string, Either<string, string>>. We need to flatten the result
        getOrElse((err) => err) // In case of any left (error) value, it would be stopped and show error. So, if clients or executor is left, the show would not be called, but onLeft in getOrElse would be called
      )
    ))
);
