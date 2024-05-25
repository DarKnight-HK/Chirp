import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { profileId: string } }
) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!params.profileId) {
      return new NextResponse("Profile ID missing", { status: 404 });
    }
    if (profile.id != params.profileId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { name, imageUrl, bio } = await req.json();
    if (!name || !imageUrl) {
      return new NextResponse("Name or image missing", { status: 404 });
    }
    const server = await db.profile.update({
      where: {
        id: profile.id,
        email: profile.email,
      },
      data: {
        name,
        imageUrl,
        bio,
      },
    });
    return NextResponse.json(server);
  } catch (error) {
    console.log("[PROFILE_UPDATE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
