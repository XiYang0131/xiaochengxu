Page({
  data: {
    optionA: '',
    optionB: '',
    weights: {
      price: 40,
      performance: 30,
      experience: 20,
      convenience: 10
    },
    scores: {
      optionA: null,
      optionB: null
    },
    hasResult: false,
    recommendedOption: '',
    matchPercent: '0.0',
    explanation: ''
  },

  // Handle input for option A and option B
  onOptionInput(event) {
    const field = event.currentTarget.dataset.field;
    const value = event.detail.value;
    this.setData({ [field]: value });
  },

  // Click handler: mock loading and generate random comparison data
  onCompare() {
    const { optionA, optionB } = this.data;

    if (!optionA.trim() || !optionB.trim()) {
      wx.showToast({
        title: '请先输入两个选项',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({ title: '对比中...' });

    setTimeout(() => {
      const scores = this.generateMockScores();
      this.setData({
        scores,
        hasResult: true
      });
      this.calculateAndUpdateResult();
      wx.hideLoading();
    }, 500);
  },

  // Slider update: change weight and recalculate in real-time
  onWeightChange(event) {
    const key = event.currentTarget.dataset.key;
    const value = Number(event.detail.value);

    this.setData({
      [`weights.${key}`]: value
    });

    if (this.data.hasResult) {
      this.calculateAndUpdateResult();
    }
  },

  // Generate random scores (0-100) for each metric and option
  generateMockScores() {
    return {
      optionA: {
        price: this.randomScore(),
        performance: this.randomScore(),
        experience: this.randomScore(),
        convenience: this.randomScore()
      },
      optionB: {
        price: this.randomScore(),
        performance: this.randomScore(),
        experience: this.randomScore(),
        convenience: this.randomScore()
      }
    };
  },

  randomScore() {
    return Math.floor(Math.random() * 101);
  },

  // Calculate weighted totals, winner, match percent and explanation
  calculateAndUpdateResult() {
    const { weights, scores, optionA, optionB } = this.data;

    if (!scores.optionA || !scores.optionB) return;

    const totalA = this.calculateWeightedTotal(scores.optionA, weights);
    const totalB = this.calculateWeightedTotal(scores.optionB, weights);

    const winnerIsA = totalA >= totalB;
    const winnerName = winnerIsA ? optionA : optionB;
    const winnerScore = winnerIsA ? totalA : totalB;
    const allScore = totalA + totalB;
    const matchPercent = allScore === 0 ? 50 : (winnerScore / allScore) * 100;

    const explanation = winnerIsA
      ? `“${optionA}”在当前权重下综合得分更高，特别是在关键维度上表现更好。`
      : `“${optionB}”在当前权重下综合得分更高，特别是在关键维度上表现更好。`;

    this.setData({
      recommendedOption: winnerName,
      matchPercent: matchPercent.toFixed(1),
      explanation
    });
  },

  calculateWeightedTotal(optionScores, weights) {
    return (
      optionScores.price * weights.price +
      optionScores.performance * weights.performance +
      optionScores.experience * weights.experience +
      optionScores.convenience * weights.convenience
    );
  }
});
