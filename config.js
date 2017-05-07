const config = {
  oauth: {
    server: {
      protocol: 'http',
      host: 'localhost:9004',
      callback: '/callback',
      transport: 'session',
      state: true
    },
    github: {
      client_id: 'a1bcdb7abb55d9c3e5a6',
      client_secret: 'ca0f8d2dd716cf1304390e3818a8593df8b080be',
      state: '666',
      // scope: ['access'],
      callback: 'http://localhost:9004/callback'
    }
  }
}

export default config
