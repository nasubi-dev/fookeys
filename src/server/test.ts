export async function startMatchmaking(
  playerID: string
): Promise<string | null> {
  await updatePlayerField(playerID, "match", 1);
  const waitingPlayerID = await findWaitingPlayer(playerID);

  if (waitingPlayerID) {
    const gameID = await addGame(playerID, waitingPlayerID);

    await Promise.all([
      updatePlayerFields([waitingPlayerID, playerID], {
        enemyID: playerID,
        gameID,
      }),
      updatePlayerFields([waitingPlayerID, playerID], { match: -1 }),
    ]);

    console.log(
      `Match successful! Enemy ID: ${waitingPlayerID}, Game ID: ${gameID}`
    );

    router.push({ name: "battle", params: { gameID } });

    return gameID;
  } else {
    console.log("Waiting for a match...");

    const unsubscribe = onSnapshot(doc(playersRef, playerID), (doc) => {
      const data = doc.data();

      if (!data) return;

      if (data.match === -1) {
        console.log(
          `Match successful! Enemy ID: ${data.enemyID}, Game ID: ${data.gameID}`
        );

        unsubscribe();

        router.push({ name: "battle", params: { gameID: data.gameID } });
      }
    });

    return null;
  }
}
