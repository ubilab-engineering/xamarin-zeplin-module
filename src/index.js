/**
 * Export functions you want to work with, see documentation for details:
 * https://github.com/zeplin/zeplin-extension-documentation
 */
import colorsTemplate from './templates/colors.mustache';
import namespaceTemplate from './templates/namespace.mustache';
import fontsTemplate from './templates/fonts.mustache';
import indentString from 'indent-string';

  function actualKey(context, key) {    
    return key.replace(/\s/g, '');
  }

function UIColor(context, color) {
    return {
      key:  color.name,
      color: (`new UIColor(red: ${color.r}/255, green: ${color.g}/255, blue: ${color.b}/255, alpha: ${color.a})`),
    };
  }

  function UIFontWeight(fontWeight) {
    switch (fontWeight) {
      case 100: return 'Thin';
      case 200: return 'ExtraLight';
      case 300: return 'Light';
      case 350: return 'SemiLight';
      case 400: return 'Normal';
      case 500: return 'Medium';
      case 600: return 'SemiBold';
      case 700: return 'Bold';
      case 800: return 'ExtraBold';
      case 900: return 'Black';
      case 950: return 'ExtraBlack';
      default: return 'Normal';
    }
  }

  function UIStyle(context, textStyle) {
    return {
      key: actualKey(context,textStyle.name),
      foreground:textStyle.color,
      fontFamily: textStyle.fontFamily,
      fontSize: textStyle.fontSize,
      fontStyle: textStyle.fontStyle,
      fontWeight: UIFontWeight(textStyle.fontWeight),
      lineHeight: textStyle.lineHeight,
      textAlignment: textStyle.textAlign,
    };
  }


function layer(context, selectedLayer) {

}

function styleguideColors(context, colors) {
    let processedColors = colors;
    const code = colorsTemplate({
        colors: processedColors.map(color => UIColor(context, color)),
        //solidColorBrushes: processedColors.map(color => xamlSolidColorBrush(context, color)),
      });
    return CSharpiOSCode(code);
}

function styleguideTextStyles(context, textStyles) {
    const code = fontsTemplate({
        textStyles: textStyles.map(color => UIStyle(context, color))
        //solidColorBrushes: processedColors.map(color => xamlSolidColorBrush(context, color)),
      });
    return CSharpiOSCode(code);
}

function exportStyleguideColors(context, colors) {
    const resources = indentString(styleguideColors(context, colors).code, 4);
    const namescpaceName = context.getOption('namescpaceName');
    const resourceDictionary = indentString(namespaceTemplate({resources,namescpaceName }),0);
    return CSharpiOSFile(resourceDictionary, 'UIColorStyle.cs');
}

function exportStyleguideTextStyles(context, colors) {
    const resources = indentString(styleguideTextStyles(context, colors).code, 4);
    const namescpaceName = context.getOption('namescpaceName');
    const resourceDictionary = indentString(namespaceTemplate({resources,namescpaceName }),0);
    return CSharpiOSFile(resourceDictionary, 'UIFontStyle.cs');
}

function comment(context, text) {

}

function CSharpiOSCode(code) {
    return {
      code,
      language: 'swift',
    };
  }

  function CSharpiOSFile(code, filename) {
    return {
      code,
      language: 'cs',
      filename,
    };
  }
  

export default {
    layer,
    styleguideColors,
    styleguideTextStyles,
    exportStyleguideColors,
    exportStyleguideTextStyles,
    comment
};