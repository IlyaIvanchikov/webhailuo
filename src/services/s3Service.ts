import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export class S3Service {
    private s3Client: S3Client;
    private bucketName: string;

    constructor(region: string, bucketName: string) {
        this.s3Client = new S3Client({
            region,
            credentials: {
                accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || '',
                secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || '',
            },
        });
        this.bucketName = bucketName;
    }

    async uploadImage(file: File): Promise<string> {
        const key = `${Date.now()}-${file.name}.jpeg`;

        // Convert File to ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        const body = new Uint8Array(arrayBuffer);

        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            Body: body,
            ContentType: file.type,
            // ACL: 'public-read',
        });

        await this.s3Client.send(command);

        return `https://${this.bucketName}.s3.amazonaws.com/${key}`;
    }
}
