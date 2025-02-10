import React from "react";
import path from "path";
import fs from "fs";
import styles from "../page.module.css";
import Header from "../components/Header";
import StudyFilteredList from "../components/Study/StudyFilteredList";
import matter from "gray-matter";

export const metadata = {
  title: "Mag's Study",
};

const getStudyPosts = async () => {
  const postsDirectory = path.join(process.cwd(), "posts", "Study");
  const filenames = fs.readdirSync(postsDirectory);

  const posts = filenames.map((filename) => {
    const filePath = path.join(postsDirectory, filename);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(fileContent);

    let latestDate;

    if (data.date.includes(" ~ ")) {
      const [startDate, endDate] = data.date
        .split(" ~ ")
        .map((date) => new Date(date));
      latestDate = endDate;
    } else {
      latestDate = new Date(data.date);
    }
    return {
      slug: filename.replace(".mdx", ""),
      title: data.title,
      description: data.description,
      date: data.date,
      latestDate,
      filter: data.filter || [],
    };
  });
  return posts.sort((a, b) => b.latestDate - a.latestDate);
};

export default async function Study() {
  const posts = await getStudyPosts();
  const filters = [
    "All",
    ...[...new Set(posts.flatMap((post) => post.filter))].sort((a, b) =>
      a.localeCompare(b)
    ),
  ];

  return (
    <div className={styles.mainBody}>
      <div className={styles.mainContainer}>
        <Header
          title="STUDY"
          description="다시 보고 싶은 내용들을 정리합니다."
        />
        <StudyFilteredList filters={filters} posts={posts} />
      </div>
    </div>
  );
}
