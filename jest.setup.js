const fetchMock = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: async () => ({}),
  })
);

global.fetch = fetchMock;

require("@testing-library/jest-dom");

jest.mock("@/lib/supabase/client", () => {
  const auth = {
    getUser: jest.fn().mockResolvedValue({ data: { user: null } }),
    getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
    signInWithPassword: jest.fn(),
    signInWithOtp: jest.fn(),
    signInWithOAuth: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
  };
  return {
    createClient: () => ({
      auth,
      channel: () => ({
        on: () => ({
          subscribe: () => ({ unsubscribe: jest.fn() }),
        }),
      }),
      removeChannel: jest.fn(),
    }),
  };
});

jest.mock("@/lib/supabase/server", () => ({
  createClient: jest.fn(async () => ({
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: null } }),
    },
  })),
}));

jest.mock("@/lib/supabase", () => ({
  createSupabaseMiddlewareClient: jest.fn(),
}));

jest.mock("resend", () => {
  const sendMock = jest.fn();
  return {
    Resend: jest.fn().mockImplementation(() => ({
      emails: { send: sendMock },
    })),
  };
});

jest.mock("node-telegram-bot-api", () => {
  return jest.fn().mockImplementation(() => ({
    sendMessage: jest.fn(),
  }));
});
