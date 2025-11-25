import { axiosInstance } from "../utils";

class CampaignService {


    async getCampaigns() {
        const res = await axiosInstance.get("/campaigns");
        return res.data;
    }

    async getCampaignById(id: string) {
        const res = await axiosInstance.get(`/campaigns/${id}`);
        return res.data;
    }

    async getCampaignInsights() {
        const res = await axiosInstance.get("/campaigns/insights");
        return res.data;
    }

    async getCampaignInsightsById(id: string) {
        const res = await axiosInstance.get(`/campaigns/${id}/insights`);
        return res.data;
    }

    async getStreamById(id: string) {
        const res = await axiosInstance.get(`/campaigns/${id}/insights/stream`);
        return res.data;
    }

}


export default new CampaignService();