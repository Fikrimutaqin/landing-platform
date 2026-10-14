export interface ExportPageInput {
    title: string;
    pageId: string;
    organizationId: string;
    theme: {
        primaryColor: string;
        accentColor: string;
        fontFamily: string;
    };
    blocks: any[];
    tracking?: {
        fbPixelId?: string;
        ga4MeasurementId?: string;
    };
}
export declare class ExportService {
    generateStaticBundle(input: ExportPageInput): {
        html: string;
        css: string;
        js: string;
    };
    private generateCss;
    private generateJs;
    private generateHtml;
}
