import { createClient } from "@supabase/supabase-js";

// 환경 변수가 없을 경우를 대비한 기본값 설정
const supabaseUrl = "https://hwopkvwsslxgkdnpunzt.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3b3Brdndzc2x4Z2tkbnB1bnp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5MTEyMDAsImV4cCI6MjA1ODQ4NzIwMH0.XAW_I0_G9deQXkT44gFAVWIgFGr-bFlH5UWcjEgeCIc";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function addClassRecord(region: string, classNum: string) {
  try {
    const { data, error } = await supabase
      .from("class_records")
      .insert([
        {
          index: Math.floor(Date.now() / 1000), // 초 단위 타임스탬프
          region,
          class_num: classNum,
        },
      ])
      .select();

    if (error) {
      console.error("Supabase error details:", error);
      throw error;
    }

    console.log("Record added successfully:", data);
    return data?.[0] || null;
  } catch (error) {
    console.error("Error adding class record:", error);
    throw error;
  }
}
