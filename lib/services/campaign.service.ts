import { AllCampaignInsights, Campaign, CampaignInsight } from "@/types/campaign.types";
import { axiosInstance } from "../utils";

interface GetCampaignsResponse {
    campaigns: Campaign[]
    total: number
}

interface CampaignResponse {
    campaign: Campaign
}

interface CampaignsInsightsResponse {
    insights: AllCampaignInsights
}

interface CampaignInsightResponse {
    insights: CampaignInsight
}



class CampaignService {

    async getCampaigns(): Promise<GetCampaignsResponse> {
        const res = await axiosInstance.get("/campaigns");
        return res.data;
    }

    async getCampaignById(id: string): Promise<CampaignResponse> {
        const res = await axiosInstance.get(`/campaigns/${id}`);
        return res.data;
    }

    async getCampaignInsights(): Promise<CampaignsInsightsResponse> {
        const res = await axiosInstance.get("/campaigns/insights");
        return res.data;
    }

    async getCampaignInsightsById(id: string): Promise<CampaignInsightResponse> {
        const res = await axiosInstance.get(`/campaigns/${id}/insights`);
        return res.data;
    }
}


export default new CampaignService();