/**
 * Compassionate, non-punitive behavioral insight generator.
 * Converts cold log statistics into empathetic, actionable advice.
 */

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const generateCompassionateInsights = (weekdayStats, totalLogsCount) => {
  const insights = [];

  if (!weekdayStats || weekdayStats.length === 0 || totalLogsCount === 0) {
    return [
      {
        id: 'welcome',
        type: 'encouragement',
        icon: 'Sprout',
        title: 'Your Garden is Taking Root',
        message:
          'Welcome to your mindful habit journey. As you water habits and log rest days over the coming week, your unique natural rhythm will emerge here without pressure.',
        actionableTip: 'Try checking in or logging a gentle reflection for today.',
      },
    ];
  }

  // Sort weekdays to find peak and low days
  const sortedByCompletion = [...weekdayStats].sort((a, b) => b.completionRate - a.completionRate);
  const bestDay = sortedByCompletion[0];
  const lowestDay = sortedByCompletion[sortedByCompletion.length - 1];

  // 1. Peak Performance Discovery
  if (bestDay && bestDay.completionRate > 0) {
    const highDays = weekdayStats
      .filter((d) => d.completionRate >= 65)
      .map((d) => d.dayName);

    if (highDays.length >= 2) {
      insights.push({
        id: 'peak-rhythm',
        type: 'strength',
        icon: 'Sun',
        title: 'Natural Flow Rhythm',
        message: `You show vibrant consistency on ${highDays.join(', ')} (averaging ${Math.round(bestDay.completionRate)}% completion). Your focus naturally flows strongest during these windows.`,
        actionableTip: 'Schedule your most meaningful or demanding mindful intentions on these days when your energy naturally peaks.',
      });
    } else {
      insights.push({
        id: 'best-day',
        type: 'strength',
        icon: 'Sparkles',
        title: `${bestDay.dayName} Harmony`,
        message: `${bestDay.dayName}s are your most harmonious days with an impressive ${Math.round(bestDay.completionRate)}% completion rate across your habits.`,
        actionableTip: 'Notice what makes this day feel spacious and see if small parts of that routine can be gently shared with other days.',
      });
    }
  }

  // 2. Compassionate Rest & Rhythm Tuning
  if (lowestDay && lowestDay.completionRate < 50 && lowestDay.totalLogs >= 2) {
    // Check top reasons on lowest day
    const topReason = lowestDay.topReasons?.[0]?.reason;
    let reasonInsight = '';
    if (topReason && topReason !== 'None') {
      reasonInsight = ` Your reflections frequently mention "${topReason}" on this day.`;
    }

    insights.push({
      id: 'gentle-adjustment',
      type: 'gentle-adjustment',
      icon: 'Moon',
      title: `${lowestDay.dayName} Rest Pattern`,
      message: `${lowestDay.dayName}s show a completion rate of ${Math.round(lowestDay.completionRate)}%.${reasonInsight} Plants flourish through natural rest cycles rather than forced continuous output.`,
      actionableTip: `Consider setting ${lowestDay.dayName} as an intentional, celebrated Dormancy/Rest day in your weekly flexible plan, or shifting the habit check-in window to the following morning.`,
    });
  }

  // 3. Reason Distribution Insight
  const allReasons = {};
  weekdayStats.forEach((w) => {
    (w.topReasons || []).forEach((r) => {
      if (r.reason && r.reason !== 'None') {
        allReasons[r.reason] = (allReasons[r.reason] || 0) + r.count;
      }
    });
  });

  const sortedReasons = Object.entries(allReasons).sort((a, b) => b[1] - a[1]);
  if (sortedReasons.length > 0 && sortedReasons[0][1] >= 2) {
    const [primaryReason, count] = sortedReasons[0];
    let customAdvice = 'Give yourself permission to pause without feeling behind.';
    if (primaryReason === 'Low Energy') {
      customAdvice = 'When vitality dips, try scaling down the habit to a 2-minute micro-action or embrace full restorative sleep.';
    } else if (primaryReason === 'Overworked/Busy') {
      customAdvice = 'Your schedule carries heavy demands. Flexible weekly targets are specifically designed so busy days do not damage your overall progress.';
    } else if (primaryReason === 'Mental Health/Rest') {
      customAdvice = 'Honoring emotional capacity is itself a profound practice of mindfulness and self-preservation.';
    }

    insights.push({
      id: 'mindful-recovery',
      type: 'reflection',
      icon: 'HeartHandshake',
      title: `Honoring "${primaryReason}"`,
      message: `You've consciously chosen rest ${count} times citing "${primaryReason}". Acknowledging your biological limits prevents chronic burnout and keeps your garden sustainable.`,
      actionableTip: customAdvice,
    });
  }

  // 4. Weekend vs Weekday Dynamics
  const weekendLogs = weekdayStats.filter((d) => d.dayOfWeek === 0 || d.dayOfWeek === 6);
  const weekdayLogs = weekdayStats.filter((d) => d.dayOfWeek >= 1 && d.dayOfWeek <= 5);

  const avgWeekend =
    weekendLogs.reduce((acc, cur) => acc + cur.completionRate, 0) / (weekendLogs.length || 1);
  const avgWeekday =
    weekdayLogs.reduce((acc, cur) => acc + cur.completionRate, 0) / (weekdayLogs.length || 1);

  if (Math.abs(avgWeekend - avgWeekday) >= 20 && totalLogsCount >= 5) {
    if (avgWeekend > avgWeekday) {
      insights.push({
        id: 'weekend-bloomer',
        type: 'rhythm',
        icon: 'Compass',
        title: 'Weekend Rejuvenation',
        message: `Your completion is noticeably higher on weekends (${Math.round(avgWeekend)}%) compared to weekdays (${Math.round(avgWeekday)}%). Unstructured time nurtures your creative and mindful habits.`,
        actionableTip: 'Embrace this weekend surge to fulfill your weekly targets, freeing your weekdays from unnecessary pressure.',
      });
    } else {
      insights.push({
        id: 'weekday-structure',
        type: 'rhythm',
        icon: 'ShieldCheck',
        title: 'Weekday Anchors',
        message: `Your habits thrive within structured weekday schedules (${Math.round(avgWeekday)}%), while weekends offer a gentler, more spontaneous pace (${Math.round(avgWeekend)}%).`,
        actionableTip: 'Keep weekends free for rest and unstructured hobbies—your weekday consistency already carries your weekly goals!',
      });
    }
  }

  return insights;
};

