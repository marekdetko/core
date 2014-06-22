// Generated by CoffeeScript 1.7.1
(function() {
  var Messages,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Messages = (function() {
    function Messages(locale) {
      this.gnStringFromExistingGuides = __bind(this.gnStringFromExistingGuides, this);
      this.gnOneFillPerGrid = __bind(this.gnOneFillPerGrid, this);
      this.gnUndefinedVariable = __bind(this.gnUndefinedVariable, this);
      this.gnFillInVariable = __bind(this.gnFillInVariable, this);
      this.gnNoGrids = __bind(this.gnNoGrids, this);
      this.gnNoFillWildcards = __bind(this.gnNoFillWildcards, this);
      this.gnUnrecognized = __bind(this.gnUnrecognized, this);
      this.alertMessageDonate = __bind(this.alertMessageDonate, this);
      this.alertTitleDonate = __bind(this.alertTitleDonate, this);
      this.alertMessageExportError = __bind(this.alertMessageExportError, this);
      this.alertTitleExportError = __bind(this.alertTitleExportError, this);
      this.alertMessageExportSuccess = __bind(this.alertMessageExportSuccess, this);
      this.alertTitleExportSuccess = __bind(this.alertTitleExportSuccess, this);
      this.alertMessageImportNotGist = __bind(this.alertMessageImportNotGist, this);
      this.alertTitleImportNotGist = __bind(this.alertTitleImportNotGist, this);
      this.alertMessageImportGistNoSets = __bind(this.alertMessageImportGistNoSets, this);
      this.alertTitleImportGistNoSets = __bind(this.alertTitleImportGistNoSets, this);
      this.alertMessageImportGistError = __bind(this.alertMessageImportGistError, this);
      this.alertTitleImportGistError = __bind(this.alertTitleImportGistError, this);
      this.alertMessageImportSuccess = __bind(this.alertMessageImportSuccess, this);
      this.alertTitleImportSuccess = __bind(this.alertTitleImportSuccess, this);
      this.alertMessageUpdate = __bind(this.alertMessageUpdate, this);
      this.alertTitleUpdate = __bind(this.alertTitleUpdate, this);
      this.alertMessageUpdateError = __bind(this.alertMessageUpdateError, this);
      this.alertTitleUpdateError = __bind(this.alertTitleUpdateError, this);
      this.alertMessageUpToDate = __bind(this.alertMessageUpToDate, this);
      this.alertTitleUpToDate = __bind(this.alertTitleUpToDate, this);
      this.helpImportExport = __bind(this.helpImportExport, this);
      this.helpGistExport = __bind(this.helpGistExport, this);
      this.helpImportDesc = __bind(this.helpImportDesc, this);
      this.helpRemainder = __bind(this.helpRemainder, this);
      this.helpPosition = __bind(this.helpPosition, this);
      this.uiOpenInBrowser = __bind(this.uiOpenInBrowser, this);
      this.uiNiceNo = __bind(this.uiNiceNo, this);
      this.uiVerticalLast = __bind(this.uiVerticalLast, this);
      this.uiVerticalCenter = __bind(this.uiVerticalCenter, this);
      this.uiVerticalFirst = __bind(this.uiVerticalFirst, this);
      this.uiHorizontalLast = __bind(this.uiHorizontalLast, this);
      this.uiHorizontalCenter = __bind(this.uiHorizontalCenter, this);
      this.uiHorizontalFirst = __bind(this.uiHorizontalFirst, this);
      this.uiVerticalRemainder = __bind(this.uiVerticalRemainder, this);
      this.uiHorizontalRemainder = __bind(this.uiHorizontalRemainder, this);
      this.uiVerticalPosition = __bind(this.uiVerticalPosition, this);
      this.uiHorizontalPosition = __bind(this.uiHorizontalPosition, this);
      this.uiShowLogs = __bind(this.uiShowLogs, this);
      this.uiCheckForUpdates = __bind(this.uiCheckForUpdates, this);
      this.uiDonate = __bind(this.uiDonate, this);
      this.uiCancel = __bind(this.uiCancel, this);
      this.uiOk = __bind(this.uiOk, this);
      this.uiGutterMidpoint = __bind(this.uiGutterMidpoint, this);
      this.uiRowMidpoint = __bind(this.uiRowMidpoint, this);
      this.uiColumnMidpoint = __bind(this.uiColumnMidpoint, this);
      this.uiExport = __bind(this.uiExport, this);
      this.uiImport = __bind(this.uiImport, this);
      this.uiSaveSet = __bind(this.uiSaveSet, this);
      this.uiMakeGrid = __bind(this.uiMakeGrid, this);
      this.uiDebug = __bind(this.uiDebug, this);
      this.uiUpdates = __bind(this.uiUpdates, this);
      this.uiSets = __bind(this.uiSets, this);
      this.uiCustom = __bind(this.uiCustom, this);
      this.uiGrid = __bind(this.uiGrid, this);
      if (locale != null) {
        this.i18n = locale;
      }
    }

    Messages.prototype.uiGrid = function() {
      switch (this.i18n) {
        case "es_es":
          return "Retícula";
        default:
          return "Grid";
      }
    };

    Messages.prototype.uiCustom = function() {
      switch (this.i18n) {
        case "es_es":
          return "Personalizada";
        default:
          return "Custom";
      }
    };

    Messages.prototype.uiSets = function() {
      switch (this.i18n) {
        case "es_es":
          return "Sets";
        default:
          return "Sets";
      }
    };

    Messages.prototype.uiUpdates = function() {
      switch (this.i18n) {
        case "es_es":
          return "Actualizaciones";
        default:
          return "Updates";
      }
    };

    Messages.prototype.uiDebug = function() {
      switch (this.i18n) {
        case "es_es":
          return "Debug";
        default:
          return "Debug";
      }
    };

    Messages.prototype.uiMakeGrid = function() {
      switch (this.i18n) {
        case "es_es":
          return "Crear retícula";
        default:
          return "Make grid";
      }
    };

    Messages.prototype.uiSaveSet = function() {
      switch (this.i18n) {
        case "es_es":
          return "Guardar set";
        default:
          return "Save set";
      }
    };

    Messages.prototype.uiImport = function() {
      switch (this.i18n) {
        case "es_es":
          return "Importar";
        default:
          return "Import";
      }
    };

    Messages.prototype.uiExport = function() {
      switch (this.i18n) {
        case "es_es":
          return "Exportar";
        default:
          return "Export";
      }
    };

    Messages.prototype.uiColumnMidpoint = function() {
      return "Column midpoint";
    };

    Messages.prototype.uiRowMidpoint = function() {
      return "Row midpoint";
    };

    Messages.prototype.uiGutterMidpoint = function() {
      return "Gutter midpoint";
    };

    Messages.prototype.uiOk = function() {
      switch (this.i18n) {
        case "es_es":
          return "Ok";
        default:
          return "Ok";
      }
    };

    Messages.prototype.uiCancel = function() {
      switch (this.i18n) {
        case "es_es":
          return "Cancelar";
        default:
          return "Cancel";
      }
    };

    Messages.prototype.uiDonate = function() {
      switch (this.i18n) {
        case "es_es":
          return "Donar";
        default:
          return "Donate";
      }
    };

    Messages.prototype.uiCheckForUpdates = function() {
      switch (this.i18n) {
        case "es_es":
          return "Buscar actualizaciones";
        default:
          return "Check for updates";
      }
    };

    Messages.prototype.uiShowLogs = function() {
      switch (this.i18n) {
        case "es_es":
          return "Mostrar logs";
        default:
          return "Show logs";
      }
    };

    Messages.prototype.uiHorizontalPosition = function() {
      switch (this.i18n) {
        case "es_es":
          return "Posición horizontal";
        default:
          return "Horizontal position";
      }
    };

    Messages.prototype.uiVerticalPosition = function() {
      switch (this.i18n) {
        case "es_es":
          return "Posición vertical";
        default:
          return "Vertical position";
      }
    };

    Messages.prototype.uiHorizontalRemainder = function() {
      switch (this.i18n) {
        case "es_es":
          return "Resto horizontal";
        default:
          return "Horizontal remainder";
      }
    };

    Messages.prototype.uiVerticalRemainder = function() {
      switch (this.i18n) {
        case "es_es":
          return "Resto vertical";
        default:
          return "Vertical remainder";
      }
    };

    Messages.prototype.uiHorizontalFirst = function() {
      switch (this.i18n) {
        case "es_es":
          return "Izquierda";
        default:
          return "Left";
      }
    };

    Messages.prototype.uiHorizontalCenter = function() {
      switch (this.i18n) {
        case "es_es":
          return "Centro";
        default:
          return "Center";
      }
    };

    Messages.prototype.uiHorizontalLast = function() {
      switch (this.i18n) {
        case "es_es":
          return "Derecha";
        default:
          return "Right";
      }
    };

    Messages.prototype.uiVerticalFirst = function() {
      switch (this.i18n) {
        case "es_es":
          return "Arriba";
        default:
          return "Top";
      }
    };

    Messages.prototype.uiVerticalCenter = function() {
      switch (this.i18n) {
        case "es_es":
          return "Centro";
        default:
          return "Center";
      }
    };

    Messages.prototype.uiVerticalLast = function() {
      switch (this.i18n) {
        case "es_es":
          return "Abajo";
        default:
          return "Bottom";
      }
    };

    Messages.prototype.uiNiceNo = function() {
      switch (this.i18n) {
        case "es_es":
          return "No, gracias";
        default:
          return "No thanks";
      }
    };

    Messages.prototype.uiOpenInBrowser = function() {
      switch (this.i18n) {
        case "es_es":
          return "Abrir en navegador";
        default:
          return "Open in browser";
      }
    };

    Messages.prototype.helpPosition = function() {
      switch (this.i18n) {
        case "es_es":
          return "Determina dónde coloca GuideGuide una retícula cuando es más pequeña que el área disponible.";
        default:
          return "This determines where GuideGuide puts a grid when it is smaller than the available area.";
      }
    };

    Messages.prototype.helpRemainder = function() {
      switch (this.i18n) {
        case "es_es":
          return "En modo pixel, GuideGuide redondea hacia abajo los anchos con píxeles decimales y usa este ajuste para determinar qué columnas o filas reciben los pixels sobrantes.";
        default:
          return "In pixel mode, GuideGuide rounds down decimal pixel widths and uses this setting to determine which columns or rows receive the remainder pixels.";
      }
    };

    Messages.prototype.helpImportDesc = function() {
      switch (this.i18n) {
        case "es_es":
          return "Importa sets pegando una url de GitHub Gist en el campo de texto de abajo.";
        default:
          return "Import sets by pasting a GitHub Gist url in the text field below.";
      }
    };

    Messages.prototype.helpGistExport = function() {
      switch (this.i18n) {
        case "es_es":
          return 'Estos son los datos de un set de guías exportado por el plugin GuideGuide. Para importarlos, haz click en el botón "Importar" en los ajustes de GuideGuide y pega la url de este Gist, o el contenido del fichero `sets.json` en el campo de texto.';
        default:
          return 'This is guide set data exported by the GuideGuide plugin. To import them, click the "Import" button in the GuideGuide settings and paste this Gist url, or the contents of `sets.json` into the text field.';
      }
    };

    Messages.prototype.helpImportExport = function() {
      switch (this.i18n) {
        case "es_es":
          return "GuideGuide importa y exporta sus datos mediante";
        default:
          return "GuideGuide imports and exports its data via";
      }
    };

    Messages.prototype.alertTitleUpToDate = function() {
      switch (this.i18n) {
        case "es_es":
          return "Estás al día";
        default:
          return "Up to date";
      }
    };

    Messages.prototype.alertMessageUpToDate = function() {
      switch (this.i18n) {
        case "es_es":
          return "Ya tienes la última versión de GuideGuide.";
        default:
          return "GuideGuide is currently up to date.";
      }
    };

    Messages.prototype.alertTitleUpdateError = function() {
      switch (this.i18n) {
        case "es_es":
          return "Error buscando actualizaciones";
        default:
          return "Error checking for updates";
      }
    };

    Messages.prototype.alertMessageUpdateError = function() {
      switch (this.i18n) {
        case "es_es":
          return "Desgraciadamente, GuideGuide no ha sido capaz de buscar actualizaciones en este momento. Por favor, inténtalo de nuevo más adelante.";
        default:
          return "Unfortunately, GuideGuide is unable to check for updates at this time. Please try again later.";
      }
    };

    Messages.prototype.alertTitleUpdate = function() {
      return "Updates available";
    };

    Messages.prototype.alertMessageUpdate = function() {
      return "Update GuideGuide to get the latest version.";
    };

    Messages.prototype.alertTitleImportSuccess = function() {
      switch (this.i18n) {
        case "es_es":
          return "Sets importados";
        default:
          return "Sets imported";
      }
    };

    Messages.prototype.alertMessageImportSuccess = function() {
      switch (this.i18n) {
        case "es_es":
          return "Tus sets se han importado correctamente.";
        default:
          return "Your sets have successfully been imported.";
      }
    };

    Messages.prototype.alertTitleImportGistError = function() {
      switch (this.i18n) {
        case "es_es":
          return "Error de Importación";
        default:
          return "Import Error";
      }
    };

    Messages.prototype.alertMessageImportGistError = function() {
      switch (this.i18n) {
        case "es_es":
          return "Desgraciadamente, GuideGuide no ha sido capaz de importar sets en este momento. Por favor, inténtalo de nuevo más adelante.";
        default:
          return "Unfortunately, GuideGuide is unable to import sets at this time. Please try again later.";
      }
    };

    Messages.prototype.alertTitleImportGistNoSets = function() {
      switch (this.i18n) {
        case "es_es":
          return "Error de Importación";
        default:
          return "Import error";
      }
    };

    Messages.prototype.alertMessageImportGistNoSets = function() {
      switch (this.i18n) {
        case "es_es":
          return "GuideGuide no ha sido capaz de encontrar sets.json en este Gist.";
        default:
          return "GuideGuide was not able to find sets.json in this Gist.";
      }
    };

    Messages.prototype.alertTitleImportNotGist = function() {
      switch (this.i18n) {
        case "es_es":
          return "Error de Importación";
        default:
          return "Import Error";
      }
    };

    Messages.prototype.alertMessageImportNotGist = function() {
      switch (this.i18n) {
        case "es_es":
          return "El texto de entrada no contiene una url de GitHub Gist.";
        default:
          return "The input text does not contain a GitHub Gist url.";
      }
    };

    Messages.prototype.alertTitleExportSuccess = function() {
      switch (this.i18n) {
        case "es_es":
          return "Sets exportados";
        default:
          return "Sets have been exported";
      }
    };

    Messages.prototype.alertMessageExportSuccess = function(url) {
      var button;
      button = "<div><strong><a class='js-link button export-button' href='" + url + "'>" + (this.uiOpenInBrowser()) + "</a></strong></div>";
      switch (this.i18n) {
        case "es_es":
          return "Tus sets han sido exportados a un GitHub Gist secreto. " + button;
        default:
          return "Your sets have been exported to a secret GitHub Gist. " + button;
      }
    };

    Messages.prototype.alertTitleExportError = function() {
      switch (this.i18n) {
        case "es_es":
          return "Imposible exportar";
        default:
          return "Unable to export";
      }
    };

    Messages.prototype.alertMessageExportError = function() {
      switch (this.i18n) {
        case "es_es":
          return "Desgraciadamente, GuideGuide no ha sido capaz de exportar sets en este momento. Por favor, inténtalo de nuevo más adelante.";
        default:
          return "Unfortunately, GuideGuide is unable to export sets at this time. Please try again later.";
      }
    };

    Messages.prototype.alertTitleDonate = function() {
      switch (this.i18n) {
        case "es_es":
          return "¿Te gustaría donar?";
        default:
          return "Would you like to donate?";
      }
    };

    Messages.prototype.alertMessageDonate = function() {
      switch (this.i18n) {
        case "es_es":
          return "¡Vaya, ya has usado GuideGuide 30 veces! Parece que le estás sacando bastante partido a GuideGuide, ¿te interesaría hacer una donación para contribuir a su desarrollo?";
        default:
          return "Yowza, you've used GuideGuide 30 times! Since you seem to get quite a bit of use out of GuideGuide, would you consider making a donation to the development?";
      }
    };

    Messages.prototype.gnUnrecognized = function() {
      switch (this.i18n) {
        case "es_es":
          return "Hueco no reconocido";
        default:
          return "Unrecognized gap";
      }
    };

    Messages.prototype.gnNoFillWildcards = function() {
      switch (this.i18n) {
        case "es_es":
          return "Los comodines no pueden ser rellenos";
        default:
          return "Wildcards cannot be fills";
      }
    };

    Messages.prototype.gnNoGrids = function() {
      switch (this.i18n) {
        case "es_es":
          return "Esta cadena no contiene ninguna retícula";
        default:
          return "This string does not contain any grids";
      }
    };

    Messages.prototype.gnFillInVariable = function() {
      switch (this.i18n) {
        case "es_es":
          return "Las variables no pueden contener un relleno";
        default:
          return "Variables cannot contain a fill";
      }
    };

    Messages.prototype.gnUndefinedVariable = function() {
      switch (this.i18n) {
        case "es_es":
          return "Variable no definida";
        default:
          return "Undefined variable";
      }
    };

    Messages.prototype.gnOneFillPerGrid = function() {
      switch (this.i18n) {
        case "es_es":
          return "Una retícula sólo puede contener un relleno";
        default:
          return "A grid can only contain one fill";
      }
    };

    Messages.prototype.gnStringFromExistingGuides = function() {
      switch (this.i18n) {
        case "es_es":
          return "Cadena generada a partir de las guías existentes";
        default:
          return "String generated from existing guides";
      }
    };

    return Messages;

  })();

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = Messages;
  } else {
    window.Messages = Messages;
  }

}).call(this);
