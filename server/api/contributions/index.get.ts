type ContributionDay = {
  date: string
  contributionCount: number
}

type ContributionWeek = {
  contributionDays: ContributionDay[]
}

type GitHubResponse = {
  data: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          weeks: ContributionWeek[]
        }
      }
    }
  }
}

export default cachedEventHandler(async (event) => {
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN || ''
    const GITHUB_USERNAME = process.env.GITHUB_USERNAME || ''

    const query = `
    query($userName: String!) {
      user(login: $userName) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
  `

    const response = await $fetch<GitHubResponse>('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query,
            variables: { userName: GITHUB_USERNAME }
        })
    })

    const weeks = response.data.user.contributionsCollection.contributionCalendar.weeks
    const contributions = weeks.flatMap(week => 
      week.contributionDays.map(day => ({
        date: day.date,
        count: day.contributionCount
      }))
    )

    return contributions
}, {
    maxAge: 60 * 60
})
