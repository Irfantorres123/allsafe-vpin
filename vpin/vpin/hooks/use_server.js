export function useServer() {
  let BASE_URL = "http://192.168.150.88:5000";
  return {
    getServices: async () => {
      let response = await fetch(`${BASE_URL}/services/list?${Date.now()}`, {});
      if (response.status === 200) return await response.json();
      else throw new Error("Could not fetch services");
    },
    login: async (username, accountNumber, serviceId) => {
      let response = await fetch(`${BASE_URL}/users/v1/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-service-id": serviceId,
        },
        body: JSON.stringify({
          username: username,
          accountNumber: accountNumber,
        }),
      });
      if (response.status === 200) return await response.json();
      else throw new Error("Could not login");
    },
    getCode: async (userId) => {
      let response = await fetch(
        `${BASE_URL}/vcs/call?userId=${userId}&date=${Date.now()}`,
        {}
      );
      if (response.status === 200) return await response.json();
      else throw new Error("Could not fetch code");
    },
  };
}
