import type {
  AnyFramework,
  Store_CSFFile,
  Store_ModuleExport,
  Store_ModuleExports,
  DocsContextProps,
} from '@storybook/types';
import { DocsContext } from '@storybook/preview-api';
import type { StoryStore } from '@storybook/store';
import type { Channel } from '@storybook/channels';

export class ExternalDocsContext<TFramework extends AnyFramework> extends DocsContext<TFramework> {
  constructor(
    public channel: Channel,
    protected store: StoryStore<TFramework>,
    public renderStoryToElement: DocsContextProps['renderStoryToElement'],
    private processMetaExports: (metaExports: Store_ModuleExports) => Store_CSFFile<TFramework>
  ) {
    super(channel, store, renderStoryToElement, [], true);
  }

  setMeta = (metaExports: Store_ModuleExports) => {
    const csfFile = this.processMetaExports(metaExports);
    this.referenceCSFFile(csfFile, true);
  };

  storyIdByModuleExport(storyExport: Store_ModuleExport, metaExports?: Store_ModuleExports) {
    if (metaExports) {
      const csfFile = this.processMetaExports(metaExports);
      this.referenceCSFFile(csfFile, false);
    }

    // This will end up looking up the story id in the CSF file referenced above or via setMeta()
    return super.storyIdByModuleExport(storyExport);
  }
}
