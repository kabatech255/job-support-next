import Head from 'next/head'
import styles from '@/assets/stylesheets/pages/Home.module.css'
import { Layout } from '@/components/templates'
import { GetStaticProps, GetServerSideProps } from 'next'
import { useState, useEffect } from 'react'
import axios from '@/axios'
import requests from '@/Requests'
export type User = {
  id: number
  family_name: string
  given_name: string
  [k: string]: any
}

export default function Home() {
  const [user, setUser] = useState<User|any>([])
  useEffect(() => {
    axios.get(requests.currentUser).then((res) => {
      console.log(res.data)
      setUser(res.data)
    })
  }, [])

  return (
    <Layout>
      <Head>
        <title>ジョブサポート</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className="title">
            Welcome to <a href="https://nextjs.org">Next.js!</a>
          </h1>

          <p className={styles.description}>
            id: {user.id}<br />
            family_name: {user.family_name}<br />
            given_name: {user.given_name}<br />
          </p>

          <div className={styles.grid}>

            <a href="https://nextjs.org/learn" className="card">
              <h2>Learn &rarr;</h2>
              <p>Learn about Next.js in an interactive course with quizzes!</p>
            </a>

            <a
              href="https://github.com/vercel/next.js/tree/master/examples"
              className="card"
            >
              <h2>Examples &rarr;</h2>
              <p>Discover and deploy boilerplate example Next.js projects.</p>
            </a>

            <a
              href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
              className="card"
            >
              <h2>Deploy &rarr;</h2>
              <p>
                Instantly deploy your Next.js site to a public URL with Vercel.
              </p>
            </a>
          </div>
        </main>
      </div>
    </Layout>
  )
}