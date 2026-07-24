import { PlatformPressable, Text } from "expo-router/react-navigation";
import { type Route, useTheme } from "expo-router/react-navigation";
import * as React from "react";
import {
  AnimatableNumericValue,
  Pressable,
  type StyleProp,
  StyleSheet,
  type TextStyle,
  View,
  type ViewStyle,
} from "react-native";
import { Href, Link } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";
import { LinkMenuAction } from "expo-router/build/link/elements";
import { Host, RNHostView } from "@expo/ui";
import { Button, ConfirmationDialog } from "@expo/ui/swift-ui";
import { isIos } from "@/constants";

type Props = {
  /**
   * The route object which should be specified by the drawer item.
   */
  route?: Route<string>;
  /**
   * The `href` to use for the anchor tag on web
   */
  href: Href;
  /**
   * The label text of the item.
   */
  label:
    | string
    | ((props: { focused: boolean; color: string }) => React.ReactNode);
  /**
   * Icon to display for the `DrawerItem`.
   */
  icon?: (props: {
    focused: boolean;
    size: number;
    color: string;
  }) => React.ReactNode;
  /**
   * Whether to highlight the drawer item as active.
   */
  focused?: boolean;
  /**
   * Function to execute on press.
   */
  onPress: () => void;
  /**
   * Color for the icon and label when the item is active.
   */
  activeTintColor?: string;
  /**
   * Color for the icon and label when the item is inactive.
   */
  inactiveTintColor?: string;
  /**
   * Background color for item when its active.
   */
  activeBackgroundColor?: string;
  /**
   * Background color for item when its inactive.
   */
  inactiveBackgroundColor?: string;
  /**
   * Color of the touchable effect on press.
   * Only supported on Android.
   *
   * @platform android
   */
  pressColor?: string;
  /**
   * Opacity of the touchable effect on press.
   * Only supported on iOS.
   *
   * @platform ios
   */
  pressOpacity?: number;
  /**
   * Style object for the label element.
   */
  labelStyle?: StyleProp<TextStyle>;
  /**
   * Style object for the wrapper element.
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Whether label font should scale to respect Text Size accessibility settings.
   */
  allowFontScaling?: boolean;

  /**
   * Accessibility label for drawer item.
   */
  accessibilityLabel?: string;
  /**
   * ID to locate this drawer item in tests.
   */
  testID?: string;
};

/**
 * A component used to show an action item with an icon and a label in a navigation drawer.
 */
export function DrawerItem(props: Props) {
  const { colors, fonts } = useTheme();
  const [isConfirming, setIsConfirming] = React.useState(false);

  const {
    href,
    icon,
    label,
    labelStyle,
    focused = false,
    allowFontScaling,
    activeTintColor = colors.primary,
    inactiveTintColor = "",
    activeBackgroundColor = "",
    inactiveBackgroundColor = "transparent",
    style,
    onPress,
    pressColor,
    pressOpacity = 1,
    testID,
    accessibilityLabel,
    route,
    ...rest
  } = props;

  const { borderRadius = 56 } = StyleSheet.flatten(style || {});
  const color = (focused ? activeTintColor : inactiveTintColor) as string;
  const backgroundColor = focused
    ? activeBackgroundColor
    : inactiveBackgroundColor;

  const iconNode = icon ? icon({ size: 24, focused, color }) : null;
  const noPreview = (route?.params as any)?.noPreview || false;
  const bg = useThemeColor("barColor");
  return (
    <>
      <Link href={href} asChild>
        {!noPreview && <Link.Preview style={{ backgroundColor: bg }} />}
        <Link.Menu>
          <Link.MenuAction icon="square.and.arrow.up" onPress={() => {}}>
            Share
          </Link.MenuAction>
          <Link.MenuAction
            icon="trash"
            destructive
            onPress={() => {
              setIsConfirming(true);
            }}
          >
            Delete
          </Link.MenuAction>
        </Link.Menu>

        <Link.Trigger>
          <PlatformPressable
            testID={testID}
            collapsable={false}
            {...rest}
            style={StyleSheet.flatten([
              styles.container,
              { borderRadius, backgroundColor },
              style,
            ])}
            // onPress={onPress}
            role="button"
            aria-label={accessibilityLabel}
            aria-selected={focused}
            pressColor={pressColor}
            pressOpacity={pressOpacity}
            hoverEffect={{ color }}
            // href={href}
          >
            <Host matchContents>
              {/* <ConfirmationDialog
                title="Save Changes?"
                isPresented={isConfirming}
                onIsPresentedChange={setIsConfirming}
                titleVisibility="visible"
              >
                <ConfirmationDialog.Trigger> */}
              <RNHostView matchContents>
                <Item
                  borderRadius={borderRadius}
                  color={color}
                  focused={focused}
                  iconNode={iconNode}
                  label={label}
                  allowFontScaling={allowFontScaling}
                  fonts={fonts}
                  labelStyle={labelStyle}
                />
              </RNHostView>
              {/* </ConfirmationDialog.Trigger> */}
              {/* <ConfirmationDialog.Actions>
                  <Button label="Save" onPress={() => console.log("Saved")} />
                  <Button
                    label="Discard"
                    role="destructive"
                    onPress={() => console.log("Discarded")}
                  />
                  <Button label="Cancel" role="cancel" />
                </ConfirmationDialog.Actions>
                <ConfirmationDialog.Message>
                  <Text>
                    You have unsaved changes. What would you like to do?
                  </Text>
                </ConfirmationDialog.Message>
              </ConfirmationDialog> */}
            </Host>
          </PlatformPressable>
        </Link.Trigger>
      </Link>
    </>
  );
}

const Item = ({
  iconNode,
  label,
  allowFontScaling,
  color,
  focused,
  fonts,
  labelStyle,
  borderRadius,
}: {
  iconNode: React.ReactNode;
  label:
    | string
    | ((props: { focused: boolean; color: string }) => React.ReactNode);
  allowFontScaling?: boolean;
  color: string;
  focused: boolean;
  fonts: { medium: TextStyle };
  labelStyle?: StyleProp<TextStyle>;
  borderRadius: string | AnimatableNumericValue;
}) => {
  return (
    <View style={[styles.wrapper, { borderRadius }]}>
      {iconNode}
      <View style={[styles.label, { marginStart: iconNode ? 12 : 0 }]}>
        {typeof label === "string" ? (
          <Text
            numberOfLines={1}
            allowFontScaling={allowFontScaling}
            style={[styles.labelText, { color }, fonts.medium, labelStyle]}
          >
            {label}
          </Text>
        ) : (
          label({ color, focused })
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 11,
    paddingStart: 16,
    paddingEnd: 24,
  },
  label: {
    marginEnd: 12,
    marginVertical: 4,
    flex: 1,
  },
  labelText: {
    lineHeight: 24,
    textAlignVertical: "center",
  },
});
