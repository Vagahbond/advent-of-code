#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int lit_to_num(const char *needle, const char haystack[10][10],
               int haystack_size) {
  int res = -1;

  for (int i = 0; i < haystack_size; ++i) {
    if (strncmp(needle, haystack[i], strlen(haystack[i])) == 0) {
      res = i;
    }
  }

  return res;
}

int main() {
  FILE *f = fopen("inputs.txt", "r");

  char litterals[10][10] = {"zero", "one", "two",   "three", "four",
                            "five", "six", "seven", "eight", "nine"};

  int result = 0;
  char buffer[500] = {0};

  while (fgets(buffer, 500, f) != 0) {
    int first = -1;
    int last = -1;

    char *it = buffer;

    while (*it != '\0') {
      if (*it >= '0' && *it <= '9') {
        if (first == -1) {
          first = *it - '0';
        }
        last = *it - '0';
      }

      int result = lit_to_num(it, litterals, 10);
      if (result != -1) {
        if (first == -1) {
          first = result;
        }
        last = result;
      }

      it++;
    }

    if (first == -1 || last == -1) {
      puts("Empty line, continuing...");
      continue;
    }

    printf("adding %d and %d for %s", first, last, buffer);
    result += first * 10 + last;
  }

  fclose(f);

  printf("%d\n", result);

  return 0;
}
