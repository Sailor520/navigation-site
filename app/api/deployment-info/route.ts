import { NextResponse } from "next/server"

export async function GET() {
  try {
    // 获取 Vercel 环境变量中的部署信息
    const deploymentInfo = {
      deploymentId: process.env.VERCEL_DEPLOYMENT_ID || null,
      deployedAt: process.env.VERCEL_DEPLOYMENT_CREATED_AT || null,
      gitCommitSha: process.env.VERCEL_GIT_COMMIT_SHA || null,
      gitBranch: process.env.VERCEL_GIT_COMMIT_REF || null,
      gitRepo: process.env.VERCEL_GIT_REPO_SLUG || null,
      gitOwner: process.env.VERCEL_GIT_REPO_OWNER || null,
      environment: process.env.VERCEL_ENV || process.env.NODE_ENV || "development",
      region: process.env.VERCEL_REGION || null,
      url: process.env.VERCEL_URL || null,
    }

    return NextResponse.json(deploymentInfo)
  } catch (error) {
    console.error("获取部署信息失败:", error)
    return NextResponse.json({ error: "获取部署信息失败" }, { status: 500 })
  }
}
