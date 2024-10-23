export const convertPollsToText = polls => {
  return Object.values(polls).reduce((previous, poll, index, arr) => {
      const allVoters = new Set();

      // Getting every voters ID that participates to the poll
      for (const answer of poll.answers) {
          // checking if the voters is an array for supporting old structure model
          const voters = answer.voters?.length
              ? answer.voters
              : Object.keys(answer.voters);

          voters.forEach((voter) => allVoters.add(voter));
      }

      const { answers } = poll;

      answers.sort((a, b) => b.voters.length - a.voters.length);

      const answersText = answers
          .map((answer) => {
              const nrOfVotersPerAnswer = answer.voters
                  ? Object.keys(answer.voters).length
                  : 0;
              const percentage =
                  allVoters.size > 0
                      ? Math.round(
                            (nrOfVotersPerAnswer / allVoters.size) * 100
                        )
                      : 0;

              return `${answer.name}: ${answer.voters.length} (${percentage}%)
`;
          })
          .join("");

      const s = `${poll.question}

${answersText}
`;

      return previous.concat(s);
  }, "");
};