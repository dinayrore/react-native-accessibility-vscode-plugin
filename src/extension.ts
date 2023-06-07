// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as parser from "@babel/parser";
import traverse from "@babel/traverse";
import * as generator from "@babel/generator";
import * as t from "@babel/types";

// This method is called when your extension is activated
// The extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "reactnativeaccessibilityproperties.addAccessibilityProperties",
      () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
          const document = editor.document;
          const text = document.getText();

          const ast = parser.parse(text, {
            sourceType: "module",
            plugins: ["jsx"],
          });

          traverse(ast, {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            JSXOpeningElement(path) {
              const { name } = path.node.name as t.JSXIdentifier;
              if (
                [
                  "View",
                  "Text",
                  "Image",
                  "TextInput",
                  "Button",
                  "Switch",
                ].includes(name)
              ) {
                // Add accessibility properties to the component
                path.node.attributes.push(
                  t.jsxAttribute(t.jsxIdentifier("accessible")),
                  t.jsxAttribute(
                    t.jsxIdentifier("accessibilityLabel"),
                    t.stringLiteral("VoiceOver label"),
                  ),
                  t.jsxAttribute(
                    t.jsxIdentifier("accessibilityHint"),
                    t.stringLiteral("describe the elements action"),
                  ),
                  t.jsxAttribute(
                    t.jsxIdentifier("accessibilityRole"),
                    t.stringLiteral(
                      "see accessibilityRole list: https://reactnative.dev/docs/accessibility#accessibilityrole",
                    ),
                  ),
                  t.jsxAttribute(
                    t.jsxIdentifier("accessibilityState"),
                    t.stringLiteral(
                      "see accessibilityRole list: https://reactnative.dev/docs/accessibility#accessibilitystate",
                    ),
                  ),
                  t.jsxAttribute(
                    t.jsxIdentifier("accessibilityValue"),
                    t.stringLiteral(
                      "see accessibilityRole list: https://reactnative.dev/docs/accessibility#accessibilityvalue",
                    ),
                  ),
                  t.jsxAttribute(
                    t.jsxIdentifier("accessibilityValue"),
                    t.stringLiteral(
                      "custom function to be called when someone activates an accessible element by double tapping",
                    ),
                  ),
                );
              }
            },
          });

          const transformedText = generator.default(ast).code;

          const fullRange = new vscode.Range(
            document.positionAt(0),
            document.positionAt(text.length),
          );
          editor.edit((editBuilder) => {
            editBuilder.replace(fullRange, transformedText);
          });
        }
      },
    ),
  );
}
// This method is called when your extension is deactivated
export function deactivate() {}
