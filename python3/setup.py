import setuptools

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setuptools.setup(
    name="semantic_descriptors",
    version="0.0.1",
    author="Alan Pita",
    author_email="pitaman512@gmail.com",
    description="Classes for storing and transferring Domain data in a semantically grounded, neutrally normalized format",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/pitaman71/semantic-descriptors",
    project_urls={
        "Bug Tracker": "https://github.com/pitaman71/semantic-descriptors/issues",
    },
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    package_dir={"": "."},
    packages=setuptools.find_packages(where="."),
    python_requires=">=3.6",
)
