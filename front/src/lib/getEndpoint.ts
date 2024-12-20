export const getEndpoint = (): string => {
    const endpointData = JSON.parse(localStorage.getItem('endpoint_address') || JSON.stringify({ address: "localhost", port: "2425" }));
    return `http://${endpointData.address}:${endpointData.port}`;
}