class UserNormalizer {
  get(user) {
    const { name, email, avatar,timeForHundredMeters,levelScore } = user;
    return { name, email, avatar, timeForHundredMeters, levelScore };
  }

  getUser(user) {
    return this.get(user);
  }

  getLevel(timeForHundredMeters) {
  const valore = Number(timeForHundredMeters);

  if (!Number.isFinite(valore) || valore <= 0) {
    throw new Error('Tempo non valido');
  }

  const minuti = Math.floor(valore);
  const secondi = Math.round((valore - minuti) * 100);

  if (secondi >= 60) {
    throw new Error('Tempo non valido');
  }

  const tempoSecondi = minuti * 60 + secondi;

  const livello = Math.round(5073 / tempoSecondi);

  return Math.max(0, Math.min(100, livello));
}
}

export default new UserNormalizer();