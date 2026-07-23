import { useState } from "react";
import { Host, ConfirmationDialog, Button, Text } from "@expo/ui/swift-ui";

export default function MultiActionConfirmationDialogExample() {
  const [isPresented, setIsPresented] = useState(false);

  return (
    <Host matchContents>
      <ConfirmationDialog
        title="Save Changes?"
        isPresented={isPresented}
        onIsPresentedChange={setIsPresented}
        titleVisibility="visible"
      >
        <ConfirmationDialog.Trigger>
          <Button label="Close Document" onPress={() => setIsPresented(true)} />
        </ConfirmationDialog.Trigger>
        <ConfirmationDialog.Actions>
          <Button label="Save" onPress={() => console.log("Saved")} />
          <Button
            label="Discard"
            role="destructive"
            onPress={() => console.log("Discarded")}
          />
          <Button label="Cancel" role="cancel" />
        </ConfirmationDialog.Actions>
        <ConfirmationDialog.Message>
          <Text>You have unsaved changes. What would you like to do?</Text>
        </ConfirmationDialog.Message>
      </ConfirmationDialog>
    </Host>
  );
}
