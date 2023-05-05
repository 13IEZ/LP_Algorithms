//@ts-ignore
// just for testing
class PriorityQueue {
  _queue: Map<string, number[]> = new Map();

  public insert(x: number): void {
    const key = x.toString();
    if (this._queue.has(key)) {
      this._queue.get(key)?.push(x);
    } else {
      this._queue.set(key, [x]);
    }
  }

  public maximum(): number {
    const keys = Array.from(this._queue.keys()).map((key) => parseInt(key, 10));
    return Math.max(...keys);
  }

  public extractMax(): number {
    const max = this.maximum();
    const key = max.toString();
    const arr = this._queue.get(key);
    if (arr?.length === 1) {
      this._queue.delete(key);
    } else {
      this._queue.set(key, arr?.slice(0, arr?.length - 1) as number[]);
    }
    return max;
  }

  public increaseKey(x: number, k: number): void {
    if (k < x) {
      throw new Error('k should be greater than x');
    }
    this.delete(x);
    this.insert(k);
  }

  public delete(x: number): void {
    const key = x.toString();
    const arr = this._queue.get(key);
    if (arr?.length === 1) {
      this._queue.delete(key);
    } else {
      this._queue.set(key, arr?.filter((item) => item !== x) as number[]);
    }
  }

  public size(): number {
    return this._queue.size;
  }

  public sortQueue(): number[] {
    const result: number[] = [];
    while (this.size() > 0) {
      result.push(this.extractMax());
    }
    return result;
  }

  public createRandomQueue(size: number): void {
    for (let i = 0; i < size; i++) {
      this.insert(Math.floor(Math.random() * 10000));
    }
  }
}

const queue = new PriorityQueue();
queue.createRandomQueue(1000);
queue.sortQueue();

// homework
type Job = {
  priority: number;
  jobFunction: () => void;
};

class JobRunner {
  private jobQueue: Job[] = [];
  private isRunning: boolean = false;
  private readonly maxJobs: number = 10000

  public addJob(jobFunction: () => void, priority?: number): void {
    priority = priority ?? Math.floor(Math.random() * 1000);
    const job: Job = { priority, jobFunction };
    this.enqueue(job);
  }

  private enqueue(job: Job): void {
    if (this.jobQueue.length >= this.maxJobs) {
      throw new Error("Job queue is full");
    }
    this.jobQueue.push(job);
    if (!this.isRunning) {
      this.isRunning = true;
      this.runJobs();
    }
  }

  private runJobs(): void {
    while (this.jobQueue.length > 0) {
      const job = this.dequeue();
      job.jobFunction();
    }
    this.isRunning = false;
  }

  private dequeue(): Job {
    const sortedJobs: Job[] = this.jobQueue.sort((a: Job, b: Job) => b.priority - a.priority);
    return sortedJobs.shift()!;
  }
}

const runner = new JobRunner();
const t0 = performance.now();
for (let i = 0; i < 10000; i++) {
  runner.addJob(() => console.log(`Job ${i} done.`));
}
const t1 = performance.now();
console.log('All jobs added to the queue.', t1 - t0);