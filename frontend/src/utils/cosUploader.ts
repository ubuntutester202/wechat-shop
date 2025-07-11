import COS from "cos-js-sdk-v5";

// COS配置接口
export interface COSConfig {
  bucket: string;
  region: string;
  secretId?: string;
  secretKey?: string;
  getAuthorization?: (options: any, callback: (authData: any) => void) => void;
}

// 上传进度回调接口
export interface UploadProgress {
  loaded: number;
  total: number;
  percent: number;
}

// 上传结果接口
export interface UploadResult {
  url: string;
  key: string;
  etag: string;
  location: string;
}

// 上传选项接口
export interface UploadOptions {
  file: File;
  key?: string;
  onProgress?: (progress: UploadProgress) => void;
  onSuccess?: (result: UploadResult) => void;
  onError?: (error: Error) => void;
}

/**
 * 腾讯云COS上传工具类
 * 提供文件上传、进度监控、任务取消等功能
 */
export class COSUploader {
  private cos: COS;
  private config: COSConfig;
  private uploadTasks: Map<string, any> = new Map();

  constructor(config: COSConfig) {
    this.config = config;

    // 初始化COS实例
    this.cos = new COS({
      // 如果提供了固定密钥（开发环境）
      ...(config.secretId &&
        config.secretKey && {
          SecretId: config.secretId,
          SecretKey: config.secretKey,
        }),
      // 如果提供了获取临时密钥的回调（生产环境推荐）
      ...(config.getAuthorization && {
        getAuthorization: config.getAuthorization,
      }),
    });

    console.log("[COS Uploader] 初始化完成", {
      bucket: config.bucket,
      region: config.region,
      hasSecretId: !!config.secretId,
      hasGetAuth: !!config.getAuthorization,
    });
  }

  /**
   * 上传文件
   * @param options 上传选项
   * @returns Promise<UploadResult>
   */
  async uploadFile(options: UploadOptions): Promise<UploadResult> {
    const { file, key, onProgress, onSuccess, onError } = options;

    // 生成文件key
    const fileKey = key || this.generateFileKey(file);
    const taskId = `upload_${Date.now()}_${Math.random()}`;

    console.log("[COS Uploader] 开始上传文件", {
      taskId,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      key: fileKey,
      bucket: this.config.bucket,
      region: this.config.region,
    });

    return new Promise((resolve, reject) => {
      try {
        // 执行上传
        this.cos.uploadFile(
          {
            Bucket: this.config.bucket,
            Region: this.config.region,
            Key: fileKey,
            Body: file,
            SliceSize: 1024 * 1024, // 大于1MB进行分块上传

            // 任务就绪回调
            onTaskReady: (tid: string) => {
              this.uploadTasks.set(taskId, tid);
              console.log("[COS Uploader] 任务就绪", { taskId, tid });
            },

            // 进度回调
            onProgress: (progressData: any) => {
              const progress: UploadProgress = {
                loaded: progressData.loaded,
                total: progressData.total,
                percent: Math.round(
                  (progressData.loaded / progressData.total) * 100
                ),
              };

              console.log("[COS Uploader] 上传进度", {
                taskId,
                ...progress,
                speed: progressData.speed
                  ? `${(progressData.speed / 1024).toFixed(2)} KB/s`
                  : "N/A",
              });

              onProgress?.(progress);
            },
          },
          (err: any, data: any) => {
            // 清理任务记录
            this.uploadTasks.delete(taskId);

            if (err) {
              console.error("[COS Uploader] 上传失败", {
                taskId,
                error: err.message || err,
                code: err.code,
                statusCode: err.statusCode,
              });

              const error = new Error(`上传失败: ${err.message || "未知错误"}`);
              onError?.(error);
              reject(error);
            } else {
              const result: UploadResult = {
                url: data.Location.startsWith("http")
                  ? data.Location
                  : `https://${data.Location}`,
                key: data.Key,
                etag: data.ETag,
                location: data.Location,
              };

              console.log("[COS Uploader] 上传成功", {
                taskId,
                ...result,
              });

              onSuccess?.(result);
              resolve(result);
            }
          }
        );
      } catch (error) {
        console.error("[COS Uploader] 上传异常", {
          taskId,
          error: error instanceof Error ? error.message : String(error),
        });

        const err = error instanceof Error ? error : new Error("上传异常");
        onError?.(err);
        reject(err);
      }
    });
  }

  /**
   * 取消上传任务
   * @param taskId 任务ID
   */
  cancelUpload(taskId: string): boolean {
    const cosTaskId = this.uploadTasks.get(taskId);
    if (cosTaskId) {
      console.log("[COS Uploader] 取消上传任务", { taskId, cosTaskId });
      this.cos.cancelTask(cosTaskId);
      this.uploadTasks.delete(taskId);
      return true;
    }
    return false;
  }

  /**
   * 暂停上传任务
   * @param taskId 任务ID
   */
  pauseUpload(taskId: string): boolean {
    const cosTaskId = this.uploadTasks.get(taskId);
    if (cosTaskId) {
      console.log("[COS Uploader] 暂停上传任务", { taskId, cosTaskId });
      this.cos.pauseTask(cosTaskId);
      return true;
    }
    return false;
  }

  /**
   * 恢复上传任务
   * @param taskId 任务ID
   */
  resumeUpload(taskId: string): boolean {
    const cosTaskId = this.uploadTasks.get(taskId);
    if (cosTaskId) {
      console.log("[COS Uploader] 恢复上传任务", { taskId, cosTaskId });
      this.cos.restartTask(cosTaskId);
      return true;
    }
    return false;
  }

  /**
   * 生成文件key
   * @param file 文件对象
   * @returns 文件key
   */
  private generateFileKey(file: File): string {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const fileExt = file.name.split(".").pop() || "";
    return `uploads/avatar/${timestamp}_${randomStr}.${fileExt}`;
  }

  /**
   * 获取活跃任务数量
   */
  getActiveTaskCount(): number {
    return this.uploadTasks.size;
  }

  /**
   * 清理所有任务
   */
  clearAllTasks(): void {
    console.log("[COS Uploader] 清理所有任务", {
      count: this.uploadTasks.size,
    });
    this.uploadTasks.forEach((cosTaskId, taskId) => {
      this.cos.cancelTask(cosTaskId);
    });
    this.uploadTasks.clear();
  }
}

// 创建默认的COS上传器实例（用于开发环境）
// 生产环境应该使用临时密钥
export const createCOSUploader = (
  config: Partial<COSConfig> = {}
): COSUploader => {
  const defaultConfig: COSConfig = {
    bucket: "test-1250000000", // 默认桶名，需要替换
    region: "ap-guangzhou", // 默认地域
    // 开发环境可以使用固定密钥，生产环境应该使用getAuthorization
    // secretId: 'your-secret-id',
    // secretKey: 'your-secret-key',

    // 生产环境推荐使用临时密钥
    getAuthorization: (options, callback) => {
      // 这里应该调用您的后端服务获取临时密钥
      // 目前先使用mock数据，需要后续实现
      console.warn(
        "[COS Uploader] 使用模拟授权，生产环境请实现真实的临时密钥获取",
        options
      );

      // 模拟异步获取临时密钥
      setTimeout(() => {
        // 注意：这里的数据是假的，您需要从您的后端服务获取真实的临时密钥
        callback({
          TmpSecretId: "mock-tmp-secret-id",
          TmpSecretKey: "mock-tmp-secret-key",
          SecurityToken: "mock-security-token",
          StartTime: Math.floor(Date.now() / 1000),
          ExpiredTime: Math.floor(Date.now() / 1000) + 3600, // 1小时后过期
        });
      }, 100);
    },
    ...config,
  };

  return new COSUploader(defaultConfig);
};

export default COSUploader;
