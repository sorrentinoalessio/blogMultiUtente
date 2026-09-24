class UserNormalizer {
  get(user) {
    const { name, email, avatar,timeForHundredMeters,levelScore } = user;
    return { name, email, avatar, timeForHundredMeters, levelScore };
  }

  getUser(user) {
    return this.get(user);
  }

  getLevel(timeForHundredMeters) {
  const value = String(timeForHundredMeters ?? '').trim();
  let tempoSecondi;

  if (value.includes(':')) {
    const [minutes, seconds] = value.split(':').map(Number);
    if (!Number.isInteger(minutes) || !Number.isInteger(seconds) || minutes < 0 || seconds < 0 || seconds >= 60) {
      throw new Error('Tempo non valido');
    }
    tempoSecondi = minutes * 60 + seconds;
  } else {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue) || numericValue <= 0) {
      throw new Error('Tempo non valido');
    }
    tempoSecondi = numericValue > 10
      ? numericValue
      : Math.floor(numericValue) * 60 + Math.round((numericValue % 1) * 100);
  }

  if (tempoSecondi <= 0) throw new Error('Tempo non valido');

  const livello = Math.round(5073 / tempoSecondi);

  return Math.max(0, Math.min(100, livello));
}
}

export default new UserNormalizer();