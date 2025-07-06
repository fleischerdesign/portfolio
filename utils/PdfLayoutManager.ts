import jsPDF from 'jspdf';

interface Colors {
  primary: [number, number, number];
  secondary: [number, number, number];
  cardBg: [number, number, number];
}

interface TitleConfig {
  showBar: boolean;
  barWidth: number;
  barOffset: number;
}

class PdfLayoutManager {
  private doc: jsPDF;
  private measureDoc: jsPDF; // For height calculations
  private pageWidth: number;
  private pageHeight: number;
  private margin: number;
  private cardPadding: number;
  private cardWidth: number;
  private contentWidth: number;
  private yPos: number;
  private colors: Colors;
  private titleConfig: TitleConfig;

  constructor(doc: jsPDF, colors: Colors, titleConfig: TitleConfig, margin: number = 10, cardPadding: number = 5) {
    this.doc = doc;
    this.measureDoc = new jsPDF(); // Initialize for height calculations
    this.pageWidth = doc.internal.pageSize.width;
    this.pageHeight = doc.internal.pageSize.height;
    this.margin = margin;
    this.cardPadding = cardPadding;
    this.cardWidth = this.pageWidth - (this.margin * 2);
    this.contentWidth = this.cardWidth - (this.cardPadding * 2);
    this.yPos = this.margin; // Initial y position
    this.colors = colors;
    this.titleConfig = titleConfig;
  }

  public getDoc(): jsPDF {
    return this.doc;
  }

  public getYPos(): number {
    return this.yPos;
  }

  public setYPos(pos: number): void {
    this.yPos = pos;
  }

  public getPageWidth(): number {
    return this.pageWidth;
  }

  public getPageHeight(): number {
    return this.pageHeight;
  }

  public getMargin(): number {
    return this.margin;
  }

  public getCardWidth(): number {
    return this.cardWidth;
  }

  public getContentWidth(): number {
    return this.contentWidth;
  }

  private calculateTextHeight(text: string, fontSize: number, contentWidth: number): number {
    this.measureDoc.setFontSize(fontSize);
    const splitText = this.measureDoc.splitTextToSize(text, contentWidth);
    return splitText.length * 7; // lineHeight
  }

  public ensureSpace(requiredSpace: number): void {
    if (this.yPos + requiredSpace > this.pageHeight - this.margin) {
      this.doc.addPage();
      this.yPos = this.margin;
    }
  }

  public addText(
    text: string,
    fontSize: number,
    fontStyle: string = 'normal',
    textColor: [number, number, number] = this.colors.primary,
    xOffset: number = 0
  ): number {
    this.doc.setFontSize(fontSize);
    this.doc.setFont('helvetica', fontStyle);
    this.doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    const splitText = this.doc.splitTextToSize(text, this.contentWidth - xOffset);
    this.doc.text(splitText, this.margin + this.cardPadding + xOffset, this.yPos);
    const textHeight = splitText.length * 7; // lineHeight
    this.yPos += textHeight;
    return textHeight;
  }

  public addSectionTitle(
    title: string,
    showBar: boolean = this.titleConfig.showBar,
    barWidth: number = this.titleConfig.barWidth,
    barOffset: number = this.titleConfig.barOffset
  ): number {
    const textX = showBar ? this.margin + barWidth + barOffset : this.margin;

    this.doc.setFontSize(18);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(this.colors.primary[0], this.colors.primary[1], this.colors.primary[2]);
    const splitText = this.doc.splitTextToSize(title, this.contentWidth - (showBar ? barWidth + barOffset : 0));

    if (showBar) {
      const barY = this.yPos - 6;
      const barHeight = splitText.length * 7;
      this.doc.setFillColor(this.colors.secondary[0], this.colors.secondary[1], this.colors.secondary[2]);
      this.doc.rect(this.margin, barY, barWidth, barHeight, 'F');
    }

    this.doc.text(splitText, textX, this.yPos);
    const textHeight = splitText.length * 7;
    this.yPos += textHeight + 1; // Add a small buffer after title
    return textHeight + 1;
  }

  public addPageTitle(
    title: string,
    subtitle: string = '',
    showBar: boolean = true,
    barWidth: number = 4,
    barOffset: number = 8,
    titleFontSize: number = 24,
    subtitleFontSize: number = 14
  ): number {
    const textX = showBar ? this.margin + barWidth + barOffset : this.margin;

    this.doc.setFontSize(titleFontSize);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(this.colors.primary[0], this.colors.primary[1], this.colors.primary[2]);
    const titleSplitText = this.doc.splitTextToSize(title, this.contentWidth - (showBar ? barWidth + barOffset : 0));

    let totalTextHeight = titleSplitText.length * 7;

    let subtitleHeight = 0;
    let subtitleSplitText: string[] = [];
    if (subtitle) {
      this.doc.setFontSize(subtitleFontSize);
      this.doc.setFont('helvetica', 'normal');
      subtitleSplitText = this.doc.splitTextToSize(subtitle, this.contentWidth - (showBar ? barWidth + barOffset : 0));
      subtitleHeight = subtitleSplitText.length * 7;
      totalTextHeight += subtitleHeight + 2;
    }

    if (showBar) {
      const barY = this.yPos - (titleFontSize * 0.30);
      const barHeight = totalTextHeight + .5;
      this.doc.setFillColor(this.colors.secondary[0], this.colors.secondary[1], this.colors.secondary[2]);
      this.doc.rect(this.margin, barY, barWidth, barHeight, 'F');
    }

    this.doc.setFontSize(titleFontSize);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(this.colors.primary[0], this.colors.primary[1], this.colors.primary[2]);
    this.doc.text(titleSplitText, textX, this.yPos);

    let nextY = this.yPos + titleSplitText.length * 7;

    if (subtitle) {
      nextY += 2;
      this.doc.setFontSize(subtitleFontSize);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(this.colors.primary[0], this.colors.primary[1], this.colors.primary[2]);
      this.doc.text(subtitleSplitText, textX, nextY);
      nextY += subtitleSplitText.length * 7;
    }

    this.yPos = nextY + 5;
    return this.yPos;
  }

  public addCard(
    contentCallback: (layout: PdfLayoutManager, startY: number) => number,
    cardColor: [number, number, number] = this.colors.cardBg,
    borderColor: [number, number, number] = this.colors.primary,
    borderRadius: number = 3
  ): void {
    const startYForContent = this.yPos + this.cardPadding;

    // Temporarily advance yPos to calculate content height
    const tempLayout = new PdfLayoutManager(
      new jsPDF(), // Dummy doc for measurement
      this.colors,
      this.titleConfig,
      this.margin,
      this.cardPadding
    );
    tempLayout.setYPos(startYForContent);
    const contentHeight = contentCallback(tempLayout, startYForContent) - startYForContent;

    const totalCardHeight = contentHeight + (this.cardPadding * 2);

    this.ensureSpace(totalCardHeight);

    // Draw card background
    this.doc.setFillColor(cardColor[0], cardColor[1], cardColor[2]);
    this.doc.roundedRect(this.margin, this.yPos, this.cardWidth, totalCardHeight, borderRadius, borderRadius, 'F');

    // Draw card border
    this.doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
    this.doc.roundedRect(this.margin, this.yPos, this.cardWidth, totalCardHeight, borderRadius, borderRadius, 'S');

    // Execute content callback to draw actual content
    const contentStartY = this.yPos + this.cardPadding;
    this.yPos = contentCallback(this, contentStartY); // Update yPos based on content drawn

    this.yPos += this.cardPadding; // Add padding after content
  }
}

export default PdfLayoutManager;