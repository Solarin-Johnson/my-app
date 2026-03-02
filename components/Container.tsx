import { ScrollView, View , StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Container = ({
  children,
  noScroll,
}: {
  children: React.ReactNode;
  noScroll?: boolean;
}) => {
  const { top, bottom } = useSafeAreaInsets();
  const Wrapper = noScroll ? View : ScrollView;
  const style = { paddingTop: top, paddingBottom: bottom };

  const WrapperProps = noScroll
    ? {}
    : {
        contentContainerStyle: style,
      };
  return (
    <Wrapper
      style={[styles.container, noScroll && style]}
      {...WrapperProps}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Container;
