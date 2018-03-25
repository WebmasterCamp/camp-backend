export default class HelloService {
  async find(params) {
    return {status: 200, data: 'Hello, World!'}
  }
}
