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

export default cachedEventHandler(async (_event) => {
    const { github: { token, username } } = useRuntimeConfig()

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
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query,
            variables: { userName: username }
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
