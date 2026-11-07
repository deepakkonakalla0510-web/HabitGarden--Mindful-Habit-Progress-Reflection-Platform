/**
 * Non-shaming Plant Growth Evolution Calculator
 * Plant stages evolve based on cumulative mindful completions.
 * Rest days nourish dormancy without losing progress.
 */
export const STAGES = ['Seed', 'Sprout', 'Bud', 'Bloom', 'Lush Tree'];

export const STAGE_THRESHOLDS = {
  Seed: { min: 0, next: 'Sprout', needed: 3 },
  Sprout: { min: 3, next: 'Bud', needed: 8 },
  Bud: { min: 8, next: 'Bloom', needed: 15 },
  Bloom: { min: 15, next: 'Lush Tree', needed: 25 },
  'Lush Tree': { min: 25, next: null, needed: 25 },
};

/**
 * Determine plant stage based on total completed check-ins
 * @param {number} totalCompleted
 * @returns {string} stage
 */
export const calculatePlantStage = (totalCompleted) => {
  if (totalCompleted >= 25) return 'Lush Tree';
  if (totalCompleted >= 15) return 'Bloom';
  if (totalCompleted >= 8) return 'Bud';
  if (totalCompleted >= 3) return 'Sprout';
  return 'Seed';
};

/**
 * Returns stage metadata and progress percentage towards next evolution
 * @param {number} totalCompleted
 */
export const getStageProgress = (totalCompleted) => {
  const currentStage = calculatePlantStage(totalCompleted);
  const info = STAGE_THRESHOLDS[currentStage];

  if (!info.next) {
    return {
      currentStage,
      nextStage: null,
      completions: totalCompleted,
      progressPercent: 100,
      remainingForNext: 0,
      label: 'Lush, flourishing canopy in full bloom',
    };
  }

  const prevMin = info.min;
  const target = info.needed;
  const progressInLevel = Math.max(0, totalCompleted - prevMin);
  const totalInLevel = target - prevMin;
  const progressPercent = Math.min(100, Math.round((progressInLevel / totalInLevel) * 100));

  return {
    currentStage,
    nextStage: info.next,
    completions: totalCompleted,
    progressPercent,
    remainingForNext: Math.max(0, target - totalCompleted),
    label: `${progressInLevel} / ${totalInLevel} steps to ${info.next}`,
  };
};

