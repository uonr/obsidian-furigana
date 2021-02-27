import { Plugin, MarkdownView } from 'obsidian';

export default class AliasPlugin extends Plugin {
	async onload() {
		this.addCommand({
			id: 'add-ruby',
			name: 'Add <ruby> tag for selected text',
			checkCallback: (checking: boolean) => {
				let view = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (!view) {
					return false;
				}
				const editor = view.sourceMode.cmEditor;
				if (!checking) {
					const selected = editor.getSelection();
					editor.replaceSelection(`<ruby>${selected}<rt></rt></ruby>`, "end");
					const cursor = editor.getCursor();
					cursor.ch -= '</rt></ruby>'.length;
					editor.setCursor(cursor);
				}
				return true;
			}
		});
	}

	onunload() {
	}
}
